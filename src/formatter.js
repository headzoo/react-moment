module.exports = {
  removeExtraWhitespace: function(code) {
    var space_count = Math.min.apply(
      null,
      code.match(/^\s+/gm).map(function(x){
        return x.length;
      })
    );
    
    return code.replace(RegExp('^\\s{' + space_count + '}', 'gm'), '');
  },
  
  formatHTML: function(str) {
    var div = document.createElement('div');
    div.innerHTML = str.trim();
    
    return this.formatNode(div, 0).innerHTML.trim();
  },
  
  formatNode: function(node, level) {
    var indentBefore = new Array(level++ + 1).join('  '),
        indentAfter  = new Array(level - 1).join('  '),
        textNode;
    
    for (var i = 0; i < node.children.length; i++) {
      textNode = document.createTextNode('\n' + indentBefore);
      node.insertBefore(textNode, node.children[i]);
      this.formatNode(node.children[i], level);
      if (node.lastElementChild == node.children[i]) {
        textNode = document.createTextNode('\n' + indentAfter);
        node.appendChild(textNode);
      }
    }
    
    return node;
  }
};