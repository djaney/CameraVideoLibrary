angular.module('app.services')
.factory('VideoService',function(){
    var fs = fs || require('fs');
    var mime = require('mime');
    var async = require("async");
    var _walkSync = function(dir, filelist) {
        var files = fs.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function(file) {
            if (fs.statSync(dir + file).isDirectory()) {
                filelist = _walkSync(dir + file + '/', filelist);
            }
            else {
                filelist.push({
                    path: dir + file,
                    filename: file
                });
            }
        });
        return filelist;
    };

    return {
        list: [],
        getVideoDirs: function(){
            var raw = window.localStorage.getItem('videoDirs') || [];
            return JSON.parse(raw);
        },
        setVideoDirs: function(dirs){
            for(var i in dirs){
                var row = dirs[i];
                var hasTrailingSlash = /(\\|\/)$/.test(row);
                if(!hasTrailingSlash){
                    dirs[i] = row + '/';
                }
            }
            window.localStorage.setItem('videoDirs',JSON.stringify(dirs));
        },
        loadList: function(callback){
            this.list = [];
            var list = [];
            var _this = this;
            async.parallel([
                function(done){
                    angular.forEach(_this.getVideoDirs(), function(dir){
                        list = _walkSync(dir, list);
                    });
                    angular.forEach(list, function(file){
                        var isValid = /\.(mp4|mov|avi|mpeg)$/i.test(file.path);
                        if(isValid){
                            var fd = fs.openSync(file.path, 'r');
                            var stat = fs.fstatSync(fd);
                            var videoMime = mime.lookup(file.path);
                            _this.list.push({
                                title: file.filename,
                                description: file.filename,
                                path: file.path,
                                filename: file.filename,
                                mime: videoMime,
                                size: stat.size,
                                created: stat.birthtime
                            });
                        }
                    });
                    window.localStorage.setItem('videos',JSON.stringify(_this.list));
                    done();
                }
            ], callback);

        },
        getList: function(){
            if(this.list.length==0){
                var raw = window.localStorage.getItem('videos') || "[]";
                
                if(raw)
                    this.list = JSON.parse(raw);
            }

            return this.list;
        }
    };
})
;
