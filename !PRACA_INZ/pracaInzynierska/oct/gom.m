t=linspace(0,3,100);
m1=0.5*0.5.^t;
m2=0.5*1.5.^t;
m3=3*0.5.^t;
m4=3*1.5.^t;
plot(t,m1,"linewidth",6,"-2;B=0,5,C=0,5;",t,m2,"linewidth",6,\
     "-3;B=0,5,C=1,5;",t,m3,"linewidth",6,"-1;B=3,C=0,5;",t,m4,\
     "linewidth",6,"-4;B=3,C=1,5;");

grid on;
xlabel("t");
ylabel("\\mu_t");
title("Prawo Gompertza");
axis([0 3 0 16]);

print('gom.pdf','-F:15');
