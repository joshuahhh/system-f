Id = forall A. A -> A;       # type abbreviation
id = /\A. \x:A. x;           # term abbreviation
id Id id;                    # evaluating a term to normal form
test id Id id = id;          # passing test
test id Id id = \x:bool. x;  # failing test
id2 : Id = /\A. \x. x;       # another term abbreviation, but with a type
                             # annotation, which allows inference on the RHS
Nat = forall A. (A -> A) -> A -> A;
zero : Nat = /\A. \s. \z. z;
succ : Nat -> Nat = \n. /\A. \s. \z. s (n A s z);
one = succ zero;
two = succ one;
test succ one = two;
