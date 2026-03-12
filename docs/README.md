# Docs

## Git

```bash
# 查看最新提交的分支
git for-each-ref --sort=-committerdate refs/heads/ refs/remotes/ --format='%(committerdate:short) %(refname:short) %(subject)'
```

### Git Submodule

```bash
git submodule update --init --recursive
git submodule update --init --remote
```
