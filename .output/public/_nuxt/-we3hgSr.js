function n(t,e="dd/MM/yyyy"){if(!t)return"";const r=new Date(t);return e==="yyyy-MM-dd"?r.toISOString().slice(0,10):r.toLocaleDateString("vi-VN")}export{n as f};
