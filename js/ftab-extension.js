
"use strict";

// Lanczos approximation
function lngammapx(x){
  var p=[0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  x--;
  var y=p[0];
  for(var i=1; i<9; i++){
    y+=p[i]/(x+i);
  }
  var t=x+7.5;
  return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(y);
}

function bc(x,k){
    if(k!=Math.round(k)){
        return gamma(x+1)/gamma(k+1)/gamma(x-k+1);
    }else if(k<0){
        return 0;
    }
    var y=1;
    for(var i=1; i<=k; i++){
        y = y*(x-i+1)/i;
    }
    return y;
}

function ChebyshevT(n,x){
    if(Math.abs(x)<1){
        return Math.cos(n*Math.acos(x));
    }else if(x>=1){
        return cosh(n*acosh(x));
    }else{
        return Math.cos(Math.PI*n)*cosh(n*acosh(-x));
    }
}

function ChebyshevU(n,x){
    return (ChebyshevT(n+2,x)-x*ChebyshevT(n+1,x))/(x*x-1);
}

function Hermite(n,x){
    var y=0, m=Math.floor(n/2);
    for(var k=0; k<=m; k++){
        y += Math.cos(k*Math.PI)/fac(k)/fac(n-2*k)*Math.pow(2*x,n-2*k);
    }
    return y*fac(n);
}

function Laguerre(n,a,x){
    var y=0;
    for(var k=0; k<=n; k++){
        y += Math.cos(k*Math.PI)*bc(n+a,n-k)/fac(k)*Math.pow(x,k);
    }
    return y;
}

function ALP(n,m,x){
    if(n==m){
        return Math.sqrt(Math.PI)/gamma(0.5-n)*Math.pow(2*Math.sqrt(1-x*x),n);
    }else if(n-1==m){
        return x*(2.0*n-1)*ALP(m,m,x);
    }else{
        var a = ALP(m,m,x);
        var b = ALP(m+1,m,x);
        var h;
        for(var k=m+2; k<=n; k++){
          h = ((2.0*k-1)*x*b-(k-1.0+m)*a)/(k-m);
          a=b; b=h;
        }
        return b;
    }
}

function Legendre(n,m,x){
    n = Math.round(n);
    m = Math.round(m);
    if(n<0) n=-n-1;
    if(Math.abs(m)>n){
        return 0;
    }else if(m<0){
        m = -m;
        return((m%2<0.5?1:-1)*
          Math.exp(lngammapx(n-m+1)-lngammapx(n+m+1))*
          ALP(n,m,x)
        );
    }else{
        return ALP(n,m,x);
    }
}

// Lanczos approximation
function lanczos_gamma_diff(x0){
    var p=[0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    var x = x0-1;
    var y=p[0];
    for(var i=1; i<9; i++){
        y+=p[i]/(x+i);
    }
    var y1=0;
    for(var i=1; i<9; i++){
        y1-=p[i]/((x+i)*(x+i));
    }
    var t=x+7.5;
    var a = Math.sqrt(2*Math.PI)*Math.pow(t,x+0.5)*Math.exp(-t);
    return a*(((x+0.5)/t+Math.log(t)-1)*y+y1);
}

function gamma_diff(x){
    if(x<0.5){
        var c = Math.cos(Math.PI*x);
        var s = Math.sin(Math.PI*x);
        var g = lanczos_gamma(1-x);
        return Math.PI*(s*lanczos_gamma_diff(1-x)-Math.PI*c*g)/(s*s*g*g);
    }else{
        return lanczos_gamma_diff(x);
    }
}

function hzeta(s,a){
    var y=0, N=18, Npa=N+a;
    for(var k=a; k<Npa; k++){
        y+=Math.pow(k,-s);
    }
    var s2=s*(s+1)*(s+2);
    var s4=s2*(s+3)*(s+4);
    y+=Math.pow(Npa,1-s)/(s-1)+0.5*Math.pow(Npa,-s);
    y+=s*Math.pow(Npa,-s-1)/12;
    y-=s2*Math.pow(Npa,-s-3)/720;
    y+=s4*Math.pow(Npa,-s-5)/30240;
    y-=s4*(s+5)*(s+6)*Math.pow(Npa,-s-7)/1209600;
    return y;
}

function zeta(s,a){
    if(a==undefined){
        if(s>-1){
            return hzeta(s,1);
        }else{
            var a = 2*Math.pow(2*Math.PI,s-1)*Math.sin(Math.PI*s/2);
            return a*gamma(1-s)*hzeta(1-s,1);
        }
    }else{
        return hzeta(s,a);
    }
}

function digamma(x){
    return gamma_diff(x)/gamma(x);
}

function polygamma(m,x){
    if(m==0){
        return digamma(x);
    }else{
        return Math.pow(-1,m+1)*gamma(m+1)*hzeta(m+1,x);
    }
}

function psi(x,y){
    if(y==undefined){
        return digamma(x);
    }else{
        return polygamma(x,y);
    }
}

function hf(x){
var xm1,xm2,xm4,xm6,xm8,xm10,xm12,xm14,xm16,xm18,xm20;
xm1=1/x; xm2=xm1*xm1; xm4=xm2*xm2; xm6=xm4*xm2; xm8=xm6*xm2;
xm10=xm8*xm2; xm12=xm10*xm2; xm14=xm12*xm2; xm16=xm14*xm2;
xm18=xm16*xm2; xm20=xm18*xm2;
return xm1*(1
+7.44437068161936700618E2*xm2
+1.96396372895146869801E5*xm4+
2.37750310125431834034E7*xm6
+1.43073403821274636888E9*xm8
+4.33736238870432522765E10*xm10
+6.40533830574022022911E11*xm12
+4.20968180571076940208E12*xm14
+1.00795182980368574617E13*xm16
+4.94816688199951963482E12*xm18
-4.94701168645415959931E11*xm20
)/(
1+7.46437068161927678031E2*xm2
+1.97865247031583951450E5*xm4
+2.41535670165126845144E7*xm6
+1.47478952192985464958E9*xm8
+4.58595115847765779830E10*xm10
+7.08501308149515401563E11*xm12
+5.06084464593475076774E12*xm14
+1.43468549171581016479E13*xm16
+1.11535493509914254097E13*xm18
);
}

function hg(x){
var xm1,xm2,xm4,xm6,xm8,xm10,xm12,xm14,xm16,xm18,xm20;
xm1=1/x; xm2=xm1*xm1; xm4=xm2*xm2; xm6=xm4*xm2; xm8=xm6*xm2;
xm10=xm8*xm2; xm12=xm10*xm2; xm14=xm12*xm2; xm16=xm14*xm2;
xm18=xm16*xm2; xm20=xm18*xm2;
return xm2*(1
+8.1359520115168615E2*xm2
+2.35239181626478200E5*xm4
+3.12557570795778731E7*xm6
+2.06297595146763354E9*xm8
+6.83052205423625007E10*xm10
+1.09049528450362786E12*xm12
+7.57664583257834349E12*xm14
+1.81004487464664575E13*xm16
+6.43291613143049485E12*xm18
-1.36517137670871689E12*xm20
)/(1
+8.19595201151451564E2*xm2
+2.40036752835578777E5*xm4
+3.26026661647090822E7*xm6
+2.23355543278099360E9*xm8
+7.87465017341829930E10*xm10
+1.39866710696414565E12*xm12
+1.17164723371736605E13*xm14
+4.01839087307656620E13*xm16
+3.99653257887490811E13*xm18
);
}

function Si4(x){
var x2,x4,x6,x8,x10,x12,x14;
x2=x*x; x4=x2*x2; x6=x4*x2; x8=x6*x2;
x10=x8*x2; x12=x10*x2; x14=x12*x2;
return x*(1
-4.54393409816329991E-2*x2
+1.15457225751016682E-3*x4
-1.41018536821330254E-5*x6
+9.43280809438713025E-8*x8
-3.53201978997168357E-10*x10
+7.08240282274875911E-13*x12
-6.05338212010422477E-16*x14
)/(1
+1.01162145739225565E-2*x2
+4.99175116169755106E-5*x4
+1.55654986308745614E-7*x6
+3.28067571055789734E-10*x8
+4.5049097575386581E-13*x10
+3.21107051193712168E-16*x12
);
}

function Ci4(x){
var x2,x4,x6,x8,x10,x12,x14;
x2=x*x; x4=x2*x2; x6=x4*x2; x8=x6*x2;
x10=x8*x2; x12=x10*x2; x14=x12*x2;
return GAMMA+Math.log(x)+x2*(-0.25
+7.51851524438898291E-3*x2
-1.27528342240267686E-4*x4
+1.05297363846239184E-6*x6
-4.68889508144848019E-9*x8
+1.06480802891189243E-11*x10
-9.93728488857585407E-15*x12
)/(1
+1.1592605689110735E-2*x2
+6.72126800814254432E-5*x4
+2.55533277086129636E-7*x6
+6.97071295760958946E-10*x8
+1.38536352772778619E-12*x10
+1.89106054713059759E-15*x12
+1.39759616731376855E-18*x14
);
}

function Si(x){
    var s = Math.sign(x);
    x = Math.abs(x);
    if(x<4){
        return s*Si4(x);
    }else{
        return s*(0.5*Math.PI-hf(x)*Math.cos(x)-hg(x)*Math.sin(x));
    }
}

function Ci(x){
    if(x<=0){
        return NaN;
    }else if(x<4){
        return Ci4(x);
    }else{
        return hf(x)*Math.sin(x)-hg(x)*Math.cos(x);
    }
}

function ipp(a){
    if(arguments.length>1){
        a = arguments;
    }
    var i,j,d=[];
    var n = a.length;
    for(i=0; i<n; i++){
        d.push(a[i][1]);
    }
    for(i=1; i<n; i++){
        for(j=n-1; j>=i; j--){
            d[j] = (d[j]-d[j-1])/(a[j][0]-a[j-i][0]);
        }
    }
    return function(x){
        var y = d[n-1];
        for(var i=n-2; i>=0; i--){
            y = d[i]+(x-a[i][0])*y;
        }
        return y;
    };
}

function trailing_zero_count(s){
    var decimal_point = false;
    for(var i=0; i<s.length; i++){
        if(s[i]=='.'){decimal_point = true;}
        else if(s[i]=='e' || s[i]=='E'){return 0;}
    }
    if(!decimal_point) return 0;
    var i = s.length-1;
    var count = 0;
    while(i>=0 && (s[i]=='0' || s[i]=='.')){
        count++;
        i--;
    }
    return count;
}

function trailing_zero_count_min(a){
    if(a.length==0) return 0;
    var count = trailing_zero_count(a[0]);
    for(var i=1; i<a.length; i++){
        count = Math.min(count,trailing_zero_count(a[i]));
    }
    return count;
}

function trim_by_count(a,count){
    for(var i=0; i<a.length; i++){
        var n = a[i].length;
        a[i] = a[i].slice(0,n-count);
    }
}

function trim_trailing_zeroes_min(a){
    var count = trailing_zero_count_min(a);
    trim_by_count(a,count);
}

function ftos_prec(n){
    return function(x){return x.toFixed(n);};
}

function table(f,a,prec){
    if(prec==undefined) prec=10;
    var ftos = ftos_prec(prec);
    var ax = [];
    var ay = [];
    for(var i=0; i<a.length; i++){
        ax.push(str(a[i],ftos));
    }
    for(var i=0; i<a.length; i++){
        ay.push(str(f(a[i]),ftos));
    }
    trim_trailing_zeroes_min(ax);
    trim_trailing_zeroes_min(ay);
    
    var b = ["<table class='bt'><tr><th>x<th>y"];
    for(var i=0; i<a.length; i++){
        b.push("<tr><td style='text-align: right'>");
        b.push(ax[i]);
        b.push("<td style='text-align: right'>");
        b.push(ay[i]);
    }
    b.push("</table>");
    return b.join("");
}

function idm(n){
    var a = [];
    for(var i=0; i<n; i++){
        var t = [];
        for(var j=0; j<n; j++){t.push(i==j?1:0);}
        a.push(t);
    }
    return a;
}

function diag(v){
    var a = [];
    for(var i=0; i<v.length; i++){
        var t = [];
        for(var j=0; j<v.length; j++){t.push(i==j?v[i]:0);}
        a.push(t);
    }
    return a;
}

function diag_variadic(){
    if(arguments.length==1 && Array.isArray(arguments[0])){
        return diag(arguments[0]);
    }else{
        return diag(arguments);
    }
}

function det(A){
    var n = A.length;
    if(n==2){
        return A[0][0]*A[1][1]-A[0][1]*A[1][0];
    }else if(n==3){
        return (
            A[0][0]*(A[1][1]*A[2][2]-A[1][2]*A[2][1]) -
            A[1][0]*(A[0][1]*A[2][2]-A[0][2]*A[2][1]) +
            A[2][0]*(A[0][1]*A[1][2]-A[0][2]*A[1][1])
        );
    }else{
        return NaN;
    }
}

function copy_array(a){
    var b = [];
    for(var i=0; i<a.length; i++){
        if(Array.isArray(a[i])){
            b.push(copy_array(a[i]));
        }else{
            b.push(a[i]);
        }
    }
    return b;
}

function mul_inplace(r,v){
    for(var i=0; i<v.length; i++){
        v[i] = r*v[i];
    }
}

function mul_add_inplace(a,v,b,w){
    for(var i=0; i<v.length; i++){
        v[i] = a*v[i]+b*w[i];
    }
}

function swap(a,i,j){
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
}

function pivoting(A,B,n,j){
    var m = Math.abs(A[j][j]);
    var k = j;
    for(var i=j+1; i<n; i++){
        if(m<Math.abs(A[i][j])){
            m = Math.abs(A[i][j]);
            k = i;
        }
    }
    swap(A,k,j);
    swap(B,k,j);
}

function gauss_jordan(A,B,n){
    var i,j;
    for(j=0; j<n; j++){
        pivoting(A,B,n,j);
        mul_inplace(1/A[j][j],B[j]);
        mul_inplace(1/A[j][j],A[j]);
        for(i=j+1; i<n; i++){
            if(A[i][j]!=0){
                mul_add_inplace(1/A[i][j],B[i],-1,B[j]);
                mul_add_inplace(1/A[i][j],A[i],-1,A[j]);
            }
        }
    }
    for(i=0; i<n-1; i++){
        for(j=i+1; j<n; j++){
            mul_add_inplace(1,B[i],-A[i][j],B[j]);
            mul_add_inplace(1,A[i],-A[i][j],A[j]);
        }
    }
    return B;
}

function matrix_inv(A){
    var n = A[0].length;
    var E = idm(n);
    A = copy_array(A);
    return gauss_jordan(A,E,n);
}

function matrix_pow(A,n){
    if(n<0){
        A = matrix_inv(A);
        n = -n;
    }else if(n==0){
        return idm(A.length);
    }
    n--;
    var M = A;
    while(n>0){
        if(n%2==1){
            M = mul_matrix_matrix(M,A);
        }
        A = mul_matrix_matrix(A,A);
        n = Math.floor(n/2);
    }
    return M;
}

function unit_vector(v){
    var r = abs_vec(v);
    return mul_scalar_vector(1/r,v);
}

function nablah(h){
    return function nabla(f,x){
        if(x.length==2){
            return [
                (f(x[0]+h,x[1])-f(x[0]-h,x[1]))/(2*h),
                (f(x[0],x[1]+h)-f(x[0],x[1]-h))/(2*h),
            ];
        }else{
            return [
                (f(x[0]+h,x[1],x[2])-f(x[0]-h,x[1],x[2]))/(2*h),
                (f(x[0],x[1]+h,x[2])-f(x[0],x[1]-h,x[2]))/(2*h),
                (f(x[0],x[1],x[2]+h)-f(x[0],x[1],x[2]-h))/(2*h)
            ];
        }
    }
}

function rotation_matrix(phi){
    return [
        [Math.cos(phi),-Math.sin(phi)],
        [Math.sin(phi), Math.cos(phi)]
    ];
}

function apply(f,v){
    return f.apply(null,v);
}

function pli_nodes(t){
    return function(x){
        if(t.length==0){return NaN;}
        var a = 0;
        var b = t.length-1;
        if(x<t[a][0] || x>t[b][0]){return NaN;}
        var i;
        while(a<=b){
            i = a+Math.round((b-a)/2);
            if(x<t[i][0]){b = i-1;}else{a = i+1;}
        }
        i = a;
        if(i>0){
            var p1 = t[i-1];
            var p2 = t[i];
            return (p2[1]-p1[1])/(p2[0]-p1[0])*(x-p2[0])+p2[1];
        }else{
            return NaN;
        }
    };
}

function pli_fn(f,xa,xb,d){
    var a = range(xa,xb,d).map(function(x){return f(x);});
    return pli(xa,d,a);
}

function pli_general(x,y,z,w){
    if(y==undefined || z==undefined){
        return pli_nodes(x);
    }else if(w==undefined){
        return pli(x,y,z);
    }else{
        return pli_fn(x,y,z,w);
    }
}

function laplace_transform(f,x){
    var g = function(t){return f(t)*Math.exp(-x*t);};
    return gauss(g,0,40,1);
}

function delta(x,a){
    var t = Math.sqrt(Math.PI)*a*x;
    return a*Math.exp(-t*t);
}

function gcd(a,b){
    a = Math.round(Math.abs(a));
    b = Math.round(Math.abs(b));
    var h;
    while(b>0){
        h = a%b; a=b; b=h;
    }
    return a;
}

function lcm(a,b){
    a = Math.abs(a);
    b = Math.abs(b);
    return a/gcd(a,b)*b;
}

function gcd_list(a){
    if(a.length==0) return 0;
    var y = a[0];
    for(var i=1; i<a.length; i++){
        y = gcd(y,a[i]);
    }
    return y;
}

function lcm_list(a){
    if(a.length==0) return 0;
    var y = a[0];
    for(var i=1; i<a.length; i++){
        y = lcm(y,a[i]);
    }
    return y;
}

function gcd_variadic(){
    if(arguments.length==1 && Array.isArray(arguments[0])){
        return gcd_list(arguments[0]);
    }else{
        return gcd_list(arguments);
    }
}

function lcm_variadic(){
    if(arguments.length==1 && Array.isArray(arguments[0])){
        return lcm_list(arguments[0]);
    }else{
        return lcm_list(arguments);
    }
}

function isprime(n){
    n = Math.round(n);
    if(n<2) return 0;
    var m = Math.floor(Math.sqrt(n));
    for(var k=2; k<=m; k++){
        if(n%k==0) return 0;
    }
    return 1;
}

function euler_phi(n){
    n = Math.round(n);
    if(n<1) return NaN;
    var y = 1;
    for(var p=2; p<=n; p++){
        if(isprime(p) && n%p==0){
            y = y*(1-1/p);
        }
    }
    return Math.round(n*y);
}

function carmichael_lambda(n){
    if(n<1) return NaN;
    if(n==1) return 1;
    var a,i,y;
    a = factor(n);
    for(i=0; i<a.length; i++){
        y = a[i];
        if(y[0]==2){
            if(y[1]==1) y = 1;
            else if(y[1]==2) y = 2;
            else y = Math.pow(2,y[1]-2);
        }else{
            y = Math.pow(y[0],y[1]-1)*(y[0]-1);
        }
        a[i] = y;
    }
    return lcm_list(a);
}

function nextprime(n){
    while(!isprime(n))n++;
    return n;
}

function factor(n){
    n = Math.round(n);
    var a,k,m;
    a = [];
    k = 2;
    while(k<=n){
        m = 0;
        while(n%k==0){n=n/k; m++;}
        if(m!=0) a.push([k,m]);
        k = nextprime(k+1);
    }
    return a;
}

function pcf(x){
    var y = 0;
    for(var k=1; k<=x; k++){
        y+=isprime(k);
    }
    return y;
}

function sigma(k,n){
    k = Math.round(k);
    n = Math.round(n);
    if(n<1) return NaN;
    var y = 0;
    for(var d=1; d<=n; d++){
        if(n%d==0) y+=Math.pow(d,k);
    }
    return y;
}

var slider_table = {};

function slider(id,a,b){
    if(slider_table.hasOwnProperty(id)){
        var range = slider_table[id];
        range[0] = a;
        range[1] = b;
        return;
    }
    
    var range = [a,b];
    slider_table[id] = range;
    ftab[id] = a;

    var slider = document.createElement("input");
    slider.setAttribute("type","range");
    slider.setAttribute("min","0");
    slider.setAttribute("max","100");
    slider.setAttribute("value","0");
    if(graphics.w>540){
        slider.setAttribute("style","width: 14em;");
    }
    slider.addEventListener("input",function(){
        var t = this.value/100;
        ftab[id] = range[0]*(1-t)+range[1]*t;
        graphics.animation = true;
        update(graphics);
    });
    slider.addEventListener("change",function(){
        graphics.animation = false;
        update(graphics);
    });
    var content = document.createElement("div");
    content.innerHTML = id+": ";
    content.appendChild(slider);
    var adds = document.getElementById("adds");
    adds.appendChild(content);
}

var ftab_extension = {
  PT: ChebyshevT, PU: ChebyshevU, PH: Hermite, 
  PP: Legendre, PL: Laguerre, bc: bc,
  psi: psi, digamma: digamma,
  zeta: zeta, ipp: ipp, table: table,
  Si: Si, Ci: Ci, det: det, unit: unit_vector, I: idm,
  diag: diag_variadic, _matrix_pow_: matrix_pow,
  nabla: nablah(0.001), apply: apply, rot: rotation_matrix,
  pli: pli_general, L: laplace_transform, delta: delta,
  gcd: gcd_variadic, lcm: lcm_variadic,
  isprime: isprime, prime: isprime, pcf: pcf, factor: factor,
  phi: euler_phi, lambda: carmichael_lambda, sigma: sigma,
  slider: slider
};


