import {describe,it,expect} from "vitest";
import {initial,serialize} from "../../src/features/admin/form-values";
import type {Field} from "../../src/features/admin/api";

const fields:Field[]=[{name:"starts_at",type:"timestamp with time zone",required:true,readonly:false,defaultValue:null,precision:null,scale:null},{name:"status",type:"text",required:true,readonly:false,defaultValue:"open",precision:null,scale:null}];
describe("Admin timestamp roundtrip (QA-03)",()=>{
  it("serializes numeric defaults and large amounts as decimal strings",()=>{
    const money:Field[]=[{...fields[0]!,name:"price_total",type:"numeric",defaultValue:0}];
    expect(serialize(money,initial(money)).price_total).toBe("0");
    expect(serialize(money,initial(money,{price_total:"9007199254740993"})).price_total).toBe("9007199254740993");
  });
  it("preserves seconds/milliseconds when closing an existing slot",()=>{
    const original={starts_at:"2026-12-05T03:00:35.123Z",status:"open"};
    const draft=initial(fields,original);
    expect(draft.starts_at).toBe("2026-12-05T10:00:35.123");
    expect(serialize(fields,{...draft,status:"closed"},original)).toEqual({status:"closed"});
  });
  it("preserves the original precision and offset for an untouched timestamp",()=>{
    const original={starts_at:"2026-12-05T10:00:35.123456+07:00",status:"open"};
    expect(serialize(fields,initial(fields,original),original)).not.toHaveProperty("starts_at");
  });
  it("converts edited Vietnam times with minute, second and millisecond precision",()=>{
    for(const [input,expected] of [["2026-12-05T10:00","2026-12-05T03:00:00.000Z"],["2026-12-05T10:00:35","2026-12-05T03:00:35.000Z"],["2026-12-05T10:00:35.123","2026-12-05T03:00:35.123Z"]])expect(serialize(fields,{starts_at:input,status:"open"}).starts_at).toBe(expected);
  });
});
