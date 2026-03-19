// 无限极分类tree
export function tree(arr, pid = 0) {
  if (arr.length === 0) {
    return [];
  }
  let result = [];
  arr.forEach((item) => {
    if (item.pid === pid) {
      let children = tree(arr, item.id);
      if (children.length) {
        item.children = children;
      }
      item.level = 1;
      result.push(item);
    }
  });
  return result;
}

// 返回id父级所有栏目 位置
export function treeById(id, source) {
  const arr = [];
  const findId = (id, source) => {
    for (let i = 0, item; i < source.length; i++) {
      item = source[i];
      if (item.id == id) {
        arr.unshift(item);
        if (item.pid != 0) {
          findId(item.pid, source);
        }
      }
    }
  };
  findId(id, source);
  const _path = [];
  arr.forEach((item) => {
    _path.push("/" + item.pinyin);
    item.path = _path.join("");
  });
  return arr;
}
/**
 *
 * @param {Array<menu>} list
 * @param {number|string} 根节点ID
 *
 * @return tree node for element-plus
 *   {id,pid,label,children,icon,disabled,isLeaf,class,path,component,extra,...}
 */
export const buildMenuTreeNodes = (list = [], rootId = 0) => {
  const nodes = [];

  function subTreeNodes(node, allList = []) {
    for (let i = 0; i < allList.length; i++) {
      const item = allList[i];
      if (item.pid === node.id) {
        if (!node.children) {
          node.children = [];
        }

        node.children.push(convertToNode(item));
      }
    }

    if (node.children?.length) {
      node.children = node.children.sort(nodeSortable);
      node.children.forEach((n) => {
        subTreeNodes(n, allList);
      });
    }

    node.isLeaf = !node.children?.length;
  }

  function convertToNode(data) {
    const {
      id,
      pid,
      title,
      name,
      sortno = 0,
      path,
      component,
      icon,
      query,
      perms,
      type,
      status,
      extraJson,
      ...others
    } = data;

    let originExtra = {};
    if (extraJson?.length) {
      try {
        originExtra = JSON.parse(extraJson);
        if (!originExtra || typeof originExtra !== "object") {
          originExtra = {};
        }
      } catch (_e) {
        // ignore fail
      }
    }

    return {
      id,
      pid,
      label: title ?? name,
      name,
      disabled: !status,
      isLeaf: true,
      icon,
      path,
      component,
      perms,
      sortno,
      extra: {
        ...originExtra,
        ...others,
        id,
        pid,
        query,
        type,
      },
    };
  }

  function nodeSortable(a, b) {
    return a.sortno - b.sortno;
  }

  list.forEach((it) => {
    if (it.pid == rootId) {
      let node = convertToNode(it);
      subTreeNodes(node, list);

      nodes.push(node);
    }
  });

  return nodes.sort(nodeSortable);
};
