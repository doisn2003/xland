import {afterEach,describe,expect,it,vi} from "vitest";
import {loadWorkspace} from "../../src/features/admin/load-workspace";

afterEach(()=>vi.unstubAllGlobals());
const json=(data:unknown)=>new Response(JSON.stringify({data}),{headers:{"Content-Type":"application/json"}});

describe("Admin data loading",()=>{
  it("starts schema, record and locations together and keeps one cancellation signal",async()=>{
    const pending=new Map<string,(response:Response)=>void>();
    const signal=new AbortController().signal;
    vi.stubGlobal("fetch",vi.fn((url:string,init:RequestInit)=>{
      expect(init.signal).toBe(signal);
      expect(init.cache).toBe("no-store");
      return new Promise<Response>(resolve=>pending.set(url,resolve));
    }));
    const loading=loadWorkspace(["properties","property-1"],"",signal);
    // None of these requests may wait for the schema response to arrive.
    expect([...pending.keys()]).toEqual(["/admin/api/schema","/admin/api/properties/property-1","/admin/api/locations"]);
    pending.get("/admin/api/properties/property-1")!(json({id:"property-1",_version:"12"}));
    pending.get("/admin/api/locations")!(json([{code:"01"}]));
    pending.get("/admin/api/schema")!(json({properties:{create:true}}));
    await expect(loading).resolves.toMatchObject({record:{id:"property-1",_version:"12"},locations:[{code:"01"}]});
  });

  it("fetches fresh versions after a save instead of caching record data",async()=>{
    let version=1;
    vi.stubGlobal("fetch",vi.fn(async(url:string)=>json(url.endsWith("/schema")?{videos:{}}:{id:"video-1",_version:String(version)})));
    const signal=new AbortController().signal;
    expect((await loadWorkspace(["videos","video-1"],"",signal)).record?._version).toBe("1");
    version=2;
    expect((await loadWorkspace(["videos","video-1"],"saved=2",signal)).record?._version).toBe("2");
  });

  it("omits the saved marker from list requests and avoids requesting a new record",async()=>{
    const fetcher=vi.fn(async(url:string)=>json(url.endsWith("/schema")?{properties:{create:true}}:url.endsWith("/locations")?[]:{items:[],total:0,page:1,limit:25}));
    vi.stubGlobal("fetch",fetcher);
    const signal=new AbortController().signal;
    await loadWorkspace(["properties"],"q=test&saved=2",signal);
    expect(fetcher.mock.calls.map(([url])=>url)).toContain("/admin/api/properties?q=test");
    fetcher.mockClear();
    expect((await loadWorkspace(["properties","new"],"",signal)).record).toBeNull();
    expect(fetcher.mock.calls.map(([url])=>url)).toEqual(["/admin/api/schema","/admin/api/locations"]);
  });

  it("propagates a revoked or missing session to the login guard",async()=>{
    vi.stubGlobal("fetch",vi.fn(async()=>new Response(JSON.stringify({error:{message:"Vui lòng đăng nhập"}}),{status:401})));
    await expect(loadWorkspace([],"",new AbortController().signal)).rejects.toMatchObject({status:401});
  });
});
