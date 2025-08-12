function n(t,e="dd/MM/yyyy"){if(!t)return"";const y=new Date(t);return"yyyy-MM-dd"===e?y.toISOString().slice(0,10):y.toLocaleDateString("vi-VN")}export{n};
