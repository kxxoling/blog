# 用 Python 解释 Y Combinator

注：
> This is a talk given by [Sean B. Palmer](http://inamidst.com/sbp/)
> to his friends to help them, and him, to understand the construction and use of the
> [Y combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator#Y_combinator)
> from [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus).
> They forced him to publish it online. Responsibility for mistakes and misunderstandings is entirely theirs.

原文链接：[The Y Combinator Explained using Python](http://sbp.so/combinator)

## Dummy arguments

Okay, imagine that the perpetrators of Java decided to improve Python. What kind of thing would they do? My guess is that they'd force us to pass an argument to every function, so that every function is unary. That would be an obvious Java-like improvement to make to Python.

One beautiful consequence is that we have to put dummy arguments in our functions sometimes. Dummy functions make work for engineers, so it's good for the economy. So, say we just had a function that returns a constant. Dummy argument!

```python
def five(ignore):
    return 5
```


So you might have to call that using, say...

```python
five(None)
```


Which returns 5. Now, you don't necessarily have to pass the null object. You can pass anything. Actually we might as well pass the function itself, since it's hanging around.

```python
five(five)
```


So that'll give 5 as a response. The Java Cabal caused us to pass dummy arguments, and we decided to pass the function itself, since it's lying about. It's the sort of thing that an idiot like me would do anyway, but if you have a language where nothing else is defined, then the function is the only thing that's available, so it's the only thing you can pass.


## Autocall

Note that you could also abstract the five(five) pattern by making a function to get another function to call itself. This is lambda calculus we're dealing with, and our Python has been Java-ised, so you can imagine how much bizarre rubbish is going to happen. The Y combinator is hard to understand because it's abstraction piled on abstraction. What we do is to break each abstraction down, and go through them one at a time.

So here's the new function. This is actually an aside, but we will use this later:

```python
def autocall(f):
    return f(f)
```


So if we do...

```python
autocall(five)
```


Then that expands to five(five) in the body there.


## Recursivity

The Y combinator is about recursive functions, basically making them anonymisable. So everybody seems to use either factorial or fibonacci because they're unimaginative idiots who just use the same old recursive example crap that they saw in textbooks. I, on the other hand, am going to use factorial.

Here's recursive factorial in python.

```python
def factorial(n):
    if not n:
        return 1
    else:
        return n * factorial(n - 1)
```

Look at the beauty of all the stuff there! So now we have a factorial function. What's the stupidest thing we could possibly do to the factorial function whilst still having it work? Oh, I know. We could replace the factorial function with a function that creates factorial functions.

[Audience: No, rewrite in Java!]

If you were writing it in Java, you would probably in fact do this, since you would be very practiced at writing factories and that's basically what this is going to be: a factory function for creating factorial functions.

It's actually not that bad:

```python
def create_factorial():
    def factorial(n):
        if not n:
            return 1
        else:
            return n * create_factorial()(n - 1)
    return factorial
```

It just doesn't have any obvious utility yet, because we're working the explanation chain forward, but the motivation chain backwards. At the end you can try to do the reverse of it all to see what Mr Curry did.

[Audience: Does not have one argument! World asplodes!]

Exactly. So now you have to ask yourself, how do we make this crap work with one argument?

[Audience: We pass the factorial function as argument]

Since we're at the outer layer, the factorial function doesn't exist yet. We need to pass something to create_factorial before it creates factorial. In other words, we want to pass the outer layer to itself. When we defined five(...), we passed five to itself. Here, we've made create_factorial() with no argument. When we make it have an argument, we'll pass create_factorial to itself in the same way.

Incidentally, note that with the no argument version, here's how to make factorial:

```python
factorial = create_factorial()
```


It's quite obvious: create_factorial creates factorial. Surprise!


## One argument version

Now, when we have create_factorial with a dummy argument, we can use the dummy argument in the body too. Here I'll name the dummy argument c, which you can think of as standing for create_factorial. I could just name the argument create_factorial, but then you might think it's somehow referencing the global namespace, whereas actually it's just the argument involved.

So this becomes, in the Java-Python:

```python
def create_factorial(c):
    def factorial(n):
        if not n:
            return 1
        else:
            return n * c(c)(n - 1)
    return factorial
```


Now, we can't do...

factorial = create_factorial()
Because we have to pass an argument. And since we have c(c) down there, the argument needs to be create_factorial, so it's not much different.

factorial = create_factorial(create_factorial)
Recapping the abstraction

Abstract enough yet?

[Audience consternation]

Remember, before we were doing this:

```python
create_factorial()(n - 1)
```


But now it has to take an argument, so we're doing:

```python
create_factorial(create_factorial)(n - 1)
```



Which I abbreviated for His and Her comfort to just...

```python
c(c)(n - 1)
```


So we've basically murdered our factorial function with as much abstraction as we can muster, for motivations which don't even exist yet because we're running on backwards-motivation-causality. However, the steps are easy. Functions for some reason (Java revolutionaries) have to be called with an argument now. Instead of just writing a factorial function, we create a maker or factory function for it. But, bugger, that has to have an argument so we just re-write it so that this works in Java-Python.


## Dastardism

Now comes the right dastardly bit.

So we have this:

```python
def create_factorial(c):
    def factorial(n):
        if not n:
            return 1
        else:
            return n * c(c)(n - 1)
    return factorial
```


But let's say we want to do the c(c) call outside of this function, abstracting that out. In other words, the aim is that we have exactly the same function, except that instead of:

```python
return n * c(c)(n - 1)
```


We have...
```python
return n * c(n - 1)
```


In other words, we're making a pattern out of this way of doing abstract recursion. At the moment it applies to create_factorial only, and we want to make create_anything, using this pattern. So instead of create_factorial we have create_anything. And instead of factorial we have a sort of wrapper, anything. That comes out as:

```python
def create_anything(c, f):
    def anything(x):
        return c(c)(x)
    return f(anything)
```


The c(c) bit inside there is our abstracted part, the bit we just hoicked out of what we had before.

[Audience: Now we're passing it two arguments, so the world implodes]

Yes, this is against the rules. But before we fix that, we should note that we only really abstracted that c(c) bit out! Everything else is the same! So we had create_factorial. What we've done here is really take the create_ bit out, and called that create_anything. But the _factorial bit mostly remains.

Here's what's left of it:

```python
def _factorial(c):
    def factorial(n):
        if not n:
            return 1
        else:
            return n * c(n - 1)
    return factorial
```


Then, to make a factorial function that actually works using this increasingly nightmarish hyperabstraction:

factorial = create_anything(create_anything, _factorial)
In fact, when we do the single-argument abstraction here, that actually will make it a bit cleaner.



## Single argument

So we might as well do two things here. First, we're going to make create_anything only take f, which is _factorial. Second, it might as well do the factorial = create_anything(create_anything, _factorial) sort of thing at the bottom, so we don't have to do that ourselves. In other words, construct the actual function.

So then we get...

```python
def create(f):
    def create_anything(c):
        def anything(x):
            return c(c)(x)
        return f(anything)
    return create_anything(create_anything)
And to create factorial, we just do...
```


factorial = create(_factorial)
Just to prove that it actually works, here it is in the python interpreter:

```python
>>> def _factorial(c):
...     def factorial(n):
...         if not n:
...             return 1
...         else:
...             return n * c(n - 1)
...     return factorial
...
>>> def create(f):
...     def create_anything(c):
...         def anything(x):
...             return c(c)(x)
...         return f(anything)
...     return create_anything(create_anything)
...
>>> factorial = create(_factorial)
>>> factorial(6)
720
>>>
```



So, the next step... Well, there is a next step, and it does add more abstraction, but not in the same way.

Meanwhile, congratulations! The create function is the Y combinator.


## Anonymisation

The next steps are to show that we can make a lambda-only version of it, proving that it's anonymous. The first step is to rename all the variables so that it looks academic and hides all the secrets about "meaning". The second step is to rename all of the functions so that they start with _, so that we know what we have to lambdaise.

So create, the Y combinator, now becomes:

```python
def _f(f):
    def _c(c):
        def _x(x):
            return c(c)(x)
        return f(_x)
    return _c(_c)
```



The only thing that isn't going to work there, meaning that it won't let us convert this into lambda only, is _c(_c). For this to be lambda-compatible, we can't use named functions: that's what lambda means. It's all anonymous functions. return f(_x) is fine, but _c(_c) isn't fine, because we're using a function as an argument, and as the function that we're calling. You can't refer to an anonymous function more than once, because it has no name. So we can't do _c(_c) anonymously.

Thankfully, that's an autocall! You might remember I said that autocall would be handy later on:

So here's the new function. This is actually an aside, but we will use this later:

```python
def autocall(f):
    return f(f)
```


We can use autocall because f(f) are argument variables, they don't refer to function definitions. Let's add an _ to show that autocall is a function that we need to anonymise:

```python
def _autocall(x):
    return x(x)
```


And that makes it...

```python
def _f(f):
    def _autocall(x):
        return x(x)
    def _c(c):
        def _x(x):
            return c(c)(x)
        return f(_x)
    return _autocall(_c)
```


Which you can now rewrite in lambda-only form. So we've proven that our create function, the Y combinator, is entirely anonymisable. That's the point of the Y combinator, to allow recursion in a language where only anonymous functions are allowed.

If we re-write further, we get...

```python
def _f(f):
    def _x(x):
        return x(x)
    def _y(y):
        def _v(v):
            return y(y)(v)
        return f(_v)
    return _x(_y)
```



Note that, apart from adding autocall, I haven't changed the create function at all. It's exactly the same function, I'm just making the syntax as hideous as possible. The variable names above are fairly standard, whereas mine are entirely non-standard, but obviously describe what goes on in a lot more detail.


## Compressing into lambdas

If we compress _f down into lambdas, we get...

```python
Y = lambda f: (lambda x: x(x))(lambda y: f(lambda v: y(y)(v)))
```

Which works just as well as the full function:

```python
>>> Y = lambda f: (lambda x: x(x))(lambda y: f(lambda v: y(y)(v)))
>>> def _factorial(c):
...     def factorial(n):
...         if not n:
...             return 1
...         else:
...             return n * c(n - 1)
...     return factorial
...
>>> Y(_factorial)(6)
72
>>>
```


Now let's replace lambda with the letter lambda, λ, and...

```python
λ f: (λ x: x(x))(λ y: f(λ v: y(y)(v)))
```

Which is just a Pythonic equivalent of the lambda calculus version:

```python
λf.(λx.x x)(λy.f (λv.((y y) v)))
```


Essentially you're just doing alternating layers of "call this function" and "recurse this function using autocall". In fact, autocall is itself a combinator, it's called the U combinator. And a combinator, by the way, is just a function that doesn't have any free variables, so it's mostly just jargon.

We went from an easy to understand, though pretty weird, sequence of code refactorings, and then when we reached the point where we had a working and more or less easy to understand Y combinator, which we called create, we beat the snot out of it with the syntax stick until it was incomprehensible as Tom Cruise on a mesopotamian stag night.
