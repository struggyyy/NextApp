(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[177],{4534:(e,t,r)=>{Promise.resolve().then(r.bind(r,1769)),Promise.resolve().then(r.t.bind(r,9324,23)),Promise.resolve().then(r.bind(r,1788))},1769:(e,t,r)=>{"use strict";r.d(t,{default:()=>u});var n=r(5155),i=r(6046),s=r(1536),a=r(1788),l=r(5565),o=r(3463),c=r(2115);function u(){let[e,t]=(0,c.useState)(!0);(0,i.useRouter)();let{user:r}=(0,a.A)(),u=e=>{let{href:t,icon:r,children:i}=e;return(0,n.jsxs)("a",{href:t,className:(0,o.A)("flex items-center gap-2 p-2 rounded-lg","text-white/70 hover:text-white","bg-white/5 hover:bg-white/10","transition-all duration-200","backdrop-blur-sm"),children:[(0,n.jsx)(r,{className:"w-5 h-5"}),(0,n.jsx)("span",{children:i})]})};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("header",{className:"fixed top-0 left-0 right-0 z-50 bg-gray-800/50 backdrop-blur-sm border-b border-white/10",children:(0,n.jsxs)("div",{className:"flex items-center justify-between px-6 py-4",children:[(0,n.jsx)("h1",{className:"text-lg font-medium text-white/90",children:"Calendar App"}),(0,n.jsx)("button",{onClick:()=>t(!e),className:"text-white",children:e?"Hide Menu":"Show Menu"})]})}),(0,n.jsxs)("aside",{className:(0,o.A)("bg-white/10 rounded-lg shadow-lg backdrop-blur-md","fixed top-16 left-0 bottom-0 transition-transform duration-300",e?"w-64 translate-x-0":"-translate-x-full"),children:[(0,n.jsxs)("nav",{className:"p-4 space-y-2",children:[(0,n.jsx)(u,{href:"/",icon:s.itz,children:"Calendar"}),r&&r.emailVerified?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(u,{href:"/protected/user/profile",icon:s.x$1,children:"Profile"}),(0,n.jsx)(u,{href:"/protected/user/signout",icon:s.axc,children:"Sign Out"})]}):(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(u,{href:"/public/user/signin",icon:s.Zu,children:"Sign In"}),(0,n.jsx)(u,{href:"/public/user/register",icon:s.NPy,children:"Register"})]})]}),(0,n.jsx)(()=>r?(0,n.jsxs)("div",{className:(0,o.A)("p-4 border-t border-white/10","flex items-center gap-3"),children:[(0,n.jsx)("div",{className:"relative w-10 h-10 rounded-full overflow-hidden bg-white/5",children:r.photoURL?(0,n.jsx)(l.default,{src:r.photoURL,alt:"Profile",fill:!0,className:"object-cover"}):(0,n.jsx)("div",{className:(0,o.A)("w-full h-full flex items-center justify-center","text-white/50 text-lg font-medium"),children:r.displayName?r.displayName[0].toUpperCase():r.email[0].toUpperCase()})}),(0,n.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,n.jsx)("p",{className:"text-sm font-medium text-white truncate",children:r.displayName||r.email}),(0,n.jsx)("p",{className:"text-xs text-white/50 truncate",children:r.email})]})]}):null,{})]})]})}},1788:(e,t,r)=>{"use strict";r.d(t,{A:()=>c,AuthProvider:()=>o});var n=r(5155),i=r(2115),s=r(7982),a=r(4565);let l=(0,i.createContext)(),o=e=>{let{children:t}=e,[r,o]=(0,i.useState)(null),[c,u]=(0,i.useState)(!0);return(0,i.useEffect)(()=>{let e=(0,a.hg)(s.j,e=>{o(e),u(!1)});return()=>e()},[]),(0,n.jsx)(l.Provider,{value:{user:r,loading:c},children:t})},c=()=>(0,i.useContext)(l)},7982:(e,t,r)=>{"use strict";r.d(t,{db:()=>o,j:()=>l,k:()=>c});var n=r(9904),i=r(4565),s=r(7058);let a=(0,n.Wp)({apiKey:"AIzaSyARR6IyFHdezAmWYwg3e3ukVU1gk1hS-4w",authDomain:"webapp-bf511.firebaseapp.com",projectId:"webapp-bf511",storageBucket:"webapp-bf511.firebasestorage.app",messagingSenderId:"993111090444",appId:"1:993111090444:web:d76575fea5115ec8879529",measurementId:"G-2B7R6D0GSS"}),l=(0,i.xI)(a),o=(0,s.aU)(a),c=async e=>{let t={url:"".concat(window.location.origin,"/public/user/signin"),handleCodeInApp:!1};try{return await (0,i.gA)(e,t),!0}catch(e){throw console.error("Error sending verification email:",e),e}};r.e(553).then(r.bind(r,6553)).then(e=>{let{getAnalytics:t}=e;t(a)})},9324:()=>{},3435:(e,t,r)=>{"use strict";r.d(t,{k5:()=>u});var n=r(2115),i={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},s=n.createContext&&n.createContext(i),a=["attr","size","title"];function l(){return(l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach(function(t){var n,i;n=t,i=r[t],(n=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(n))in e?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function u(e){return t=>n.createElement(d,l({attr:c({},e.attr)},t),function e(t){return t&&t.map((t,r)=>n.createElement(t.tag,c({key:r},t.attr),e(t.child)))}(e.child))}function d(e){var t=t=>{var r,{attr:i,size:s,title:o}=e,u=function(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r={};for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){if(t.indexOf(n)>=0)continue;r[n]=e[n]}return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}(e,a),d=s||t.size||"1em";return t.className&&(r=t.className),e.className&&(r=(r?r+" ":"")+e.className),n.createElement("svg",l({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,i,u,{className:r,style:c(c({color:e.color||t.color},t.style),e.style),height:d,width:d,xmlns:"http://www.w3.org/2000/svg"}),o&&n.createElement("title",null,o),e.children)};return void 0!==s?n.createElement(s.Consumer,null,e=>t(e)):t(i)}}},e=>{var t=t=>e(e.s=t);e.O(0,[533,697,992,711,512,778,956,441,517,358],()=>t(4534)),_N_E=e.O()}]);