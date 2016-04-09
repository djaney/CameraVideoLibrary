electronDialog = require('electron').remote.dialog;
angular.module('app.controllers')
    .controller('HomeController',function($scope, VideoService, $timeout){
        $scope.selectedVideo = null;
        $scope.loadingFiles = false;
        $scope.videos = VideoService.getList();

        $scope.editVideo = function(video){
            var info = {
                title: video.title
            }
            VideoService.setVideoInfo(video.path, info);
        }

        $scope.selectDirectory = function(){
            var dir = electronDialog.showOpenDialog({ properties: [ 'openDirectory' ]});
            if(dir){
                VideoService.setVideoDirs([dir]);
                $scope.loadFiles();
            }

        }
        $scope.loadFiles = function(){
            $scope.loadingFiles = true;
            VideoService.loadList(function(){
                $scope.videos = VideoService.getList();
                $scope.loadingFiles = false;
                $scope.selectedVideo = null;
                if(!$scope.$$phase) $scope.$apply();
            });


        }
        $scope.selectVideo = function(video){
            $scope.selectedVideo = null;
            $timeout(function(){
                $scope.selectedVideo = video;
            });

        }
        $scope.fileSizeToHuman = function(size){
            if(size >= 1000000000){
                return (size / 1000000000).toFixed(1) + 'GB'
            }else{
                return (size / 1000000).toFixed(1) + 'MB'
            }
        }
    });
;
