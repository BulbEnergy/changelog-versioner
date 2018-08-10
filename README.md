# changelog-versioner

Tool for versioning and aggregating changelogs in a repository.

`changelog-versioner --find-changelogs-in [glob] --aggregated-output ./CHANGELOG.md --version-before-updating 0.1.0`

* this uses [minimatch](https://github.com/isaacs/node-glob) for matching

## Arguments (all required)

### Where to look for changelogs

/** list of folders to search for changelogs in */
`--find-changelogs-in string[]`

example
`--find-changelogs-in src, scripts`

### where to output aggregated changelogs

/** filepath to save aggregated changelog in */
`--aggregated-output string`

### version before updating

 `--version-before-updating 0.1.0`


### don't update

 `--no-update`

## Example

### Before

```md
// ./patterns/modules/Button/CHANGELOG.md
# CHANGELOG

## vNext

* [major] deprecated `green` which has been replaced by `primary`

## 10.1.1

* [minor] aliased `green` variant to `primary`

## 10.0.1

* [bug] fixed issue with font on samsung browser

// ./patterns/modules/Notifications/CHANGELOG.md
# CHANGELOG

## vNext

* [minor] introduced `Notifications` module

// ./CHANGELOG.md
# CHANGELOG

## vNext

## 10.1.1

### Button

* [minor] aliased `green` variant to `primary`

## 10.0.1

### Button

* [bug] fixed issue with font on samsung browser
```

```bash
changelog-version-and-aggregation --find-changelogs-in ./patterns --aggregated-output ./CHANGELOG.md --version-before-updating 10.1.1
```

### After

```md
// ./patterns/modules/Notifications/CHANGELOG.md
# CHANGELOG

## 11.0.0

* [minor] introduced `Notifications` module


// ./patterns/modules/Button/CHANGELOG.md
# CHANGELOG

## vNext

## 11.0.0

* [major] deprecated `green` which has been replaced by `primary`

## 10.1.1

* [minor] aliased `green` variant to `primary`

## 10.0.1

* [bug] fixed issue with font on samsung browser


// ./CHANGELOG.md
# CHANGELOG

## vNext

## 11.0.0

### Button

* [major] deprecated `green` which has been replaced by `primary`

### Notifications

* [minor] introduced `Notifications` module

## 10.1.1

### Button

* [minor] aliased `green` variant to `primary`

## 10.0.1

### Button

* [bug] fixed issue with font on samsung browser
```
