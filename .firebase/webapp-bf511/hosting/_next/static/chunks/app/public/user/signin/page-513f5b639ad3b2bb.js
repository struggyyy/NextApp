(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[59],{8149:(e,t,s)=>{Promise.resolve().then(s.bind(s,9223))},9223:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>u});var i=s(5155),n=s(4565),a=s(6046),r=s(2115),l=s(338),o=s(1563),c=s(6583),d=s(3463);function u(){let e=(0,n.xI)(),t=(0,a.useRouter)(),[s,u]=(0,r.useState)(""),[h,x]=(0,r.useState)(""),[w,m]=(0,r.useState)(""),[p,b]=(0,r.useState)(!1),[f,y]=(0,r.useState)(!1),[j,g]=(0,r.useState)(null),k=async()=>{t.push("/protected/user/profile")},N=async()=>{b(!0);try{await (0,n.gA)(j),m("success:Link weryfikacyjny został wysłany ponownie.")}catch(e){console.error("Error sending verification:",e),m("Wystąpił błąd podczas wysyłania weryfikacji. Spr\xf3buj ponownie p\xf3źniej.")}finally{b(!1)}},v=async i=>{i.preventDefault(),m(""),b(!0);try{await (0,n.oM)(e,n.F0);let i=await (0,n.x9)(e,s,h);if(!i.user.emailVerified){g(i.user),y(!0);return}t.push("/protected/user/profile")}catch(e){(console.error(e.code,e.message),"auth/invalid-credential"===e.code)?m("Hasło jest nieprawidłowe lub adres email nie istnieje."):m("Wystąpił błąd podczas logowania. Spr\xf3buj ponownie.")}finally{b(!1)}};return f?(0,i.jsx)("div",{className:"flex flex-col items-center justify-center min-h-[80vh]",children:(0,i.jsxs)("div",{className:(0,d.A)("w-full max-w-md p-8 rounded-xl","bg-gray-800/50 backdrop-blur-xl","border border-white/10","shadow-2xl shadow-black/10"),children:[(0,i.jsx)("h1",{className:"text-2xl font-medium text-white/90 mb-8 text-center",children:"Weryfikacja Email"}),(0,i.jsxs)("div",{className:"space-y-6 text-white/70",children:[(0,i.jsx)("p",{className:"text-center",children:"Email nie został jeszcze zweryfikowany."}),(0,i.jsxs)("p",{className:"text-center",children:["Link weryfikacyjny został wysłany na adres:",(0,i.jsx)("br",{}),(0,i.jsx)("span",{className:"font-medium text-white",children:s})]}),(0,i.jsx)("p",{className:"text-center",children:"Sprawdź swoją skrzynkę pocztową i kliknij w link weryfikacyjny."})]}),w&&(0,i.jsx)("div",{className:(0,d.A)("mt-6 p-4 rounded-lg",w.startsWith("success:")?"bg-green-500/10 border border-green-500/20 text-green-400":"bg-red-500/10 border border-red-500/20 text-red-400"),children:(0,i.jsx)("p",{children:w.replace("success:","")})}),(0,i.jsxs)("div",{className:"mt-8 space-y-4",children:[(0,i.jsx)("button",{onClick:k,disabled:p,className:(0,d.A)("w-full py-2 px-4 rounded-lg","bg-white/10 hover:bg-white/15","text-white font-medium","transition-all duration-200","focus:outline-none focus:ring-2 focus:ring-white/25","disabled:opacity-50"),children:"Kontynuuj bez weryfikacji"}),(0,i.jsx)("button",{onClick:N,disabled:p,className:(0,d.A)("w-full py-2 px-4 rounded-lg","bg-white/5 hover:bg-white/10","text-white/70 font-medium","transition-all duration-200","focus:outline-none focus:ring-2 focus:ring-white/25","disabled:opacity-50"),children:p?"Wysyłanie...":"Wyślij ponownie link weryfikacyjny"}),(0,i.jsx)("p",{className:"text-sm text-center text-white/50",children:"Zalecamy weryfikację emaila w celu zwiększenia bezpieczeństwa konta"})]})]})}):(0,i.jsx)("div",{className:"flex flex-col items-center justify-center min-h-[80vh]",children:(0,i.jsxs)("form",{onSubmit:v,className:(0,d.A)("w-full max-w-md p-8 rounded-xl","bg-gray-800/50 backdrop-blur-xl","border border-white/10","shadow-2xl shadow-black/10"),children:[(0,i.jsx)("h1",{className:"text-2xl font-medium text-white/90 mb-8 text-center",children:"Sign In"}),w&&(0,i.jsx)("div",{className:"mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400",children:(0,i.jsx)("span",{children:w})}),(0,i.jsxs)("div",{className:"space-y-6",children:[(0,i.jsxs)(l.D,{children:[(0,i.jsx)(o.JU,{className:"text-sm/6 font-medium text-white/70",children:"Email"}),(0,i.jsx)(c.p,{type:"email",value:s,onChange:e=>u(e.target.value),className:(0,d.A)("mt-2 block w-full rounded-lg border-none","bg-white/5 py-2 px-3 text-white","focus:outline-none focus:ring-2 focus:ring-white/25","placeholder:text-white/30"),required:!0})]}),(0,i.jsxs)(l.D,{children:[(0,i.jsx)(o.JU,{className:"text-sm/6 font-medium text-white/70",children:"Password"}),(0,i.jsx)(c.p,{type:"password",value:h,onChange:e=>x(e.target.value),className:(0,d.A)("mt-2 block w-full rounded-lg border-none","bg-white/5 py-2 px-3 text-white","focus:outline-none focus:ring-2 focus:ring-white/25","placeholder:text-white/30"),required:!0})]})]}),(0,i.jsx)("button",{type:"submit",disabled:p,className:(0,d.A)("mt-8 w-full py-2 px-4 rounded-lg","bg-white/10 hover:bg-white/15","text-white font-medium","transition-all duration-200","focus:outline-none focus:ring-2 focus:ring-white/25","disabled:opacity-50"),children:p?"Logowanie...":"Sign In"})]})})}}},e=>{var t=t=>e(e.s=t);e.O(0,[697,512,535,441,517,358],()=>t(8149)),_N_E=e.O()}]);