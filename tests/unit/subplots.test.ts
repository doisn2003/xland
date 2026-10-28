import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {entity} from '../../src/features/user/wire';
import {routeFor,validQuery} from '../../src/features/user/routes';
describe('property hierarchy wire boundary',()=>{
  const sample=JSON.parse(readFileSync('tests/fixtures/property.json','utf8'));
  it('defaults missing additive fields and preserves explicit child fields',()=>{
    expect(entity(sample,'Property').oldAddress).toBeNull();
    expect(entity({...sample,communeName:'Đặc khu Vân Đồn',oldAddress:'Địa chỉ cũ'},'Property').oldAddress).toBe('Địa chỉ cũ');
    expect(entity(sample,'Property').hasSubplots).toBe(false);
    const child=entity({...sample,parentPropertyId:'parent',hasSubplots:true,isCorner:true,priceTotal:'9007199254740993'},'Property');
    expect(child.parentPropertyId).toBe('parent');expect(child.hasSubplots).toBe(true);expect(child.isCorner).toBe(true);expect(child.priceTotal).toBe('9007199254740993');
    expect(()=>entity({...sample,hasSubplots:'true'},'Property')).toThrow();
  });
  it('allows read-only child pagination through the BFF',()=>{
    const path='/properties/00000000-0000-4000-8000-000000000005/children';
    const rule=routeFor('GET',path);expect(rule).toBeTruthy();
    expect(validQuery(rule!,new URLSearchParams('limit=4&cursor=opaque'))).toBe(true);
    expect(routeFor('POST',path)).toBeUndefined();
  });
});
