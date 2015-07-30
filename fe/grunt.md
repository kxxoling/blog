# Grunt 开发配置

## Chrome 插件配置自动刷新

[LiveReload.com](http://livereload.com/) 提供了一个 [Chrome 插件](https://chrome.google.com/webstore/detail/jnihajbhpnppcggbcgedagnkighmdlei)
支持 Grunt watch 自动刷新。

最简单的支持 Grunt watch autoreload 的配置如下：

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      projectName: {
        files: ["prjectDir/*"],
        options: {
          livereload: true
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};
```

