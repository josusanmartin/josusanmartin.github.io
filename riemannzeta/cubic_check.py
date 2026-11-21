"""Exact trace-constant arithmetic for the quartic window. Requires SymPy."""
from sympy import Poly, Rational as Q, symbols
x = symbols("x")
v = Poly(1 - Q(743,500)*(x-Q(1,2))**2 + Q(1197,1000)*(x-Q(1,2))**4, x)
X = Poly(x,x)
def integ(p):
    f = p.integrate()
    return f.eval(1) - f.eval(0)
A = integ(v)
F = v.integrate()
assert F.eval(0) == 0
# The integral of |x-y| v(y) over the translated interval [0,1].
potential = 2*(X*F - (X*v).integrate()) + Poly(integ(X*v),x) - X*A
J2,J3 = integ(v**2), integ(v**3)
D2,D3 = integ(v*potential), integ(v**2*potential)
H3 = 2*integ(F**3)/A**3
r2 = (J2+D2)/A**2
r3 = 3*r2-2 + J3/A**3 - 3*J2/A**2 + 3*D3/A**3 + 2*H3
def bound(a):
    return (9-10*a + 2*(1+a)*r2 - r3 + (8-4*a-a*a)*Q(19,27))/(18-12*a)
C = bound(Q(37,1000))
assert C == Q(9206426916034466876368351,10819864495774716474708000)
assert C > Q(8508819,10000000)
for key,val in [('r2', r2),('r3', r3),('a=0',bound(0)),('C',C)]:
    print(key, val, float(val))
