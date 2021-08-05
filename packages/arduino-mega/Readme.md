# LBA Arduino Spec 1a

| Position | Value      | Length |
|----------|------------|--------|
| 0        | Command    | 1      |
| 1        | Pin number | 2      |
| 3        | Value      | 1-60   |


## Command

`I` Initialize: Setup pin config
`U` Update State


## Pin

Any integer between `00` and `99`. It must have 2 characters.

## Value

Either `0` or `1` when updating state or the appropriate message format for the initializer.