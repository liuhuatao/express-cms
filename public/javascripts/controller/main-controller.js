var mainApp = angular.module('mainApp', []);

mainApp.directive('myPagination', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      option: '=pageOption'
    },
    template: '<ul class="shop-pagi display-inline">' +
    '<li ng-click="pageClick(p)" ng-repeat="p in page" class="{{option.curr==p?\'active\':\'\'}}">' +
    '<a href="javascript:;">{{p}}</a>' +
    '</li>' +
    '</ul>',
    link: function ($scope) {
      $scope.$watch("option",
        function () {
          //This gets called when data changes.
          //容错处理
          if (!$scope.option.curr || isNaN($scope.option.curr) || $scope.option.curr < 1) $scope.option.curr = 1;
          if (!$scope.option.all || isNaN($scope.option.all) || $scope.option.all < 1) $scope.option.all = 1;
          if ($scope.option.curr > $scope.option.all) $scope.option.curr = $scope.option.all;
          if (!$scope.option.count || isNaN($scope.option.count) || $scope.option.count < 1) $scope.option.count = 10;


          //得到显示页数的数组
          $scope.page = getRange($scope.option.curr, $scope.option.all, $scope.option.count);

          //绑定点击事件
          $scope.pageClick = function (page) {
            if (page == '«') {
              page = parseInt($scope.option.curr) - 1;
            } else if (page == '»') {
              page = parseInt($scope.option.curr) + 1;
            }
            if (page < 1) page = 1;
            else if (page > $scope.option.all) page = $scope.option.all;
            //点击相同的页数 不执行点击事件
            if (page == $scope.option.curr) return;
            if ($scope.option.click && typeof $scope.option.click === 'function') {
              $scope.option.click(page);
              $scope.option.curr = page;
              $scope.page = getRange($scope.option.curr, $scope.option.all, $scope.option.count);
            }
          };

          //返回页数范围（用来遍历）
          function getRange(curr, all, count) {
            //计算显示的页数
            curr = parseInt(curr);
            all = parseInt(all);
            count = parseInt(count);
            var from = curr - parseInt(count / 2);
            var to = curr + parseInt(count / 2) + (count % 2) - 1;
            //显示的页数容处理
            if (from <= 0) {
              from = 1;
              to = from + count - 1;
              if (to > all) {
                to = all;
              }
            }
            if (to > all) {
              to = all;
              from = to - count + 1;
              if (from <= 0) {
                from = 1;
              }
            }
            var range = [];
            for (var i = from; i <= to; i++) {
              range.push(i);
            }
            range.push('»');
            range.unshift('«');
            return range;
          }
        });
    }
  }
});

mainApp.controller('bodyController', function ($rootScope, $scope, mainService) {
  var cid = mainService.getQueryStringByName('cid');
  $rootScope.isActive = isActive;
  $rootScope.goUrl = goUrl;


  function isActive(item) {
    if (router === item) {
      return 'active';
    }
  }

  function getAllCategory() {
    mainService.getAllCategory(function (res) {
      $scope.categoryList = res.data.data;
      console.log($scope.categoryList);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }

  function getCategoryById(cid) {
    mainService.getCategoryById(cid, function (res) {
      $scope.category = res.data.data;
      console.log($scope.category);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }

  function goUrl(url) {
    window.open(url);
  }

  getCategoryById(cid);
  getAllCategory();
});

mainApp.factory('mainService', function ($http, $rootScope, $location) {
  $rootScope.apiUrl = 'http://118.25.25.192:8360';
  var apiUrl = $rootScope.apiUrl;
  return {
    getDocumentById: getDocumentById,
    getDocumentByCId: getDocumentByCId,
    getCategoryById: getCategoryById,
    getAllCategory: getAllCategory,
    getQueryStringByName: getQueryStringByName,
    postQuestion: postQuestion
  };


  function getDocumentById(id, successCb, errorCb) {
    $http({
      method: 'GET',
      url: apiUrl + '/api/document/' + id
    }).then(function successCallback(response) {
      successCb(response);
      // 请求成功执行代码
    }, function errorCallback(err) {
      // 请求失败执行代码
      if (errorCb) errorCb(err);
    });
  }

  function getDocumentByCId(cid, pageIndex, pageSize, successCb, errorCb) {
    pageIndex = pageIndex ? pageIndex : 1;
    $http({
      method: 'GET',
      url: apiUrl + '/api/document/?cid=' + cid + '&page=' + pageIndex + '&pageSize=' + pageSize
    }).then(function successCallback(response) {
      successCb(response);
      // 请求成功执行代码
    }, function errorCallback(err) {
      // 请求失败执行代码
      if (errorCb) errorCb(err);
    });
  }

  function getCategoryById(id, successCb, errorCb) {
    $http({
      method: 'GET',
      url: apiUrl + '/api/category/' + id
    }).then(function successCallback(response) {
      successCb(response);
      // 请求成功执行代码
    }, function errorCallback(err) {
      // 请求失败执行代码
      if (errorCb) errorCb(err);
    });
  }

  function getAllCategory(successCb, errorCb) {
    $http({
      method: 'GET',
      url: apiUrl + '/api/category'
    }).then(function successCallback(response) {
      successCb(response);
      // 请求成功执行代码
    }, function errorCallback(err) {
      // 请求失败执行代码
      if (errorCb) errorCb(err);
    });
  }

  function getQueryStringByName(name) {
    var sValue = $location.absUrl().match(new RegExp('[\?\&]' + name + '=([^\&]*)(\&?)', 'i'));
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (sValue) {
      return sValue[1];
    } else if (r !== null) {
      return unescape(r[2]);
    } else {
      return null;
    }
  }

  function postQuestion() {
    $http({
      method: 'POST',
      url: apiUrl + '/api/category'
    }).then(function successCallback(response) {
      successCb(response);
      // 请求成功执行代码
    }, function errorCallback(err) {
      // 请求失败执行代码
      if (errorCb) errorCb(err);
    });
  }
});

//作品
mainApp.controller('worksController', function ($scope, $http, mainService, $rootScope) {
  var cid = mainService.getQueryStringByName('cid');

  $scope.getDocumentById = getDocumentById;
  $scope.option = {};
  init();

  function init() {
    getDocumentByCId(cid, 1, 12);
  }

  //获取分类详细
  function getDocumentByCId(cid, pageIndex, pageSize) {
    mainService.getDocumentByCId(cid, pageIndex, pageSize, function (res) {
      $scope.list = res.data.data;
      //设置分页的参数
      $scope.option = {
        curr: $scope.list.currentPage,  //当前页数
        all: $scope.list.totalPages,  //总页数
        count: $scope.list.pageSize,  //最多显示的页数，默认为10

        //点击页数的回调函数，参数page为点击的页数
        click: function (page) {
          getDocumentByCId(cid, page, 12);
          //这里可以写跳转到某个页面等...
        }
      }
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }

  //获取文章详细
  function getDocumentById(id) {
    mainService.getDocumentById(id, function (res) {
      $rootScope.detail = res.data.data;
      $rootScope.detail.atlas = JSON.parse($rootScope.detail.atlas);
      console.log($rootScope.detail);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }
});

//相册
mainApp.controller('photoController', function ($scope, $http, mainService, $rootScope) {
  var cid = mainService.getQueryStringByName('cid');

  $scope.getDocumentByCId = getDocumentByCId;
  $scope.getDocumentById = getDocumentById;
  $scope.option = {};
  init();

  function init() {
    getDocumentByCId(cid, 1, 10);
  }

  function getDocumentByCId(cid, pageIndex, pageSize) {
    mainService.getDocumentByCId(cid, pageIndex, pageSize, function (res) {
      $scope.list = res.data.data;
      console.log($scope.list);
      //设置分页的参数
      $scope.option = {
        curr: $scope.list.currentPage,  //当前页数
        all: $scope.list.totalPages,  //总页数
        count: $scope.list.pageSize,  //最多显示的页数，默认为10

        //点击页数的回调函数，参数page为点击的页数
        click: function (page) {
          getDocumentByCId(cid, page, 10);
          //这里可以写跳转到某个页面等...
        }
      }
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }

  function getDocumentById(id) {
    mainService.getDocumentById(id, function (res) {
      $rootScope.detail = res.data.data;
      $rootScope.detail.atlas = JSON.parse($rootScope.detail.atlas);
      console.log($rootScope.detail);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }
});

//学术
mainApp.controller('researchController', function ($scope, $http, mainService, $rootScope) {
  var cid = mainService.getQueryStringByName('cid');

  $scope.getDocumentById = getDocumentById;
  // $scope.option = {
  //   curr: 0,  //当前页数
  //   all: 0,  //总页数
  //   count: 0 //最多显示的页数，默认为10
  // };
  init();

  function init() {
    getDocumentByCId(cid, 1, 10);
  }

  function getDocumentByCId(cid, pageIndex, pageSize) {
    mainService.getDocumentByCId(cid, pageIndex, pageSize, function (res) {
      $scope.list = res.data.data;
      //设置分页的参数
      $scope.option = {
        curr: $scope.list.currentPage,  //当前页数
        all: $scope.list.totalPages,  //总页数
        count: $scope.list.pageSize,  //最多显示的页数，默认为10

        //点击页数的回调函数，参数page为点击的页数
        click: function (page) {
          getDocumentByCId(cid, page, 10);
          //这里可以写跳转到某个页面等...
        }
      }
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }

  function getDocumentById(id) {
    mainService.getDocumentById(id, function (res) {
      $rootScope.detail = res.data.data;
      $rootScope.detail.atlas = JSON.parse($rootScope.detail.atlas);
      console.log($rootScope.detail);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }
});

//动态
mainApp.controller('newsController', function ($scope, $http, mainService, $rootScope) {
  var cid = mainService.getQueryStringByName('cid');
  $scope.cid = cid;

  $scope.getDocumentById = getDocumentById;
  // $scope.option = {
  //   curr: 0,  //当前页数
  //   all: 0,  //总页数
  //   count: 0 //最多显示的页数，默认为10
  // };
  init();

  function init() {
    getDocumentByCId(cid, 1, 10);
  }

  function getDocumentByCId(cid, pageIndex, pageSize) {
    mainService.getDocumentByCId(cid, pageIndex, pageSize, function (res) {
      $scope.list = res.data.data;
      console.log($scope.list);
      //设置分页的参数
      $scope.option = {
        curr: $scope.list.currentPage,  //当前页数
        all: $scope.list.totalPages,  //总页数
        count: $scope.list.pageSize,  //最多显示的页数，默认为10

        //点击页数的回调函数，参数page为点击的页数
        click: function (page) {
          getDocumentByCId(cid, page, 10);
          //这里可以写跳转到某个页面等...
        }
      }
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }

  function getDocumentById(id) {
    mainService.getDocumentById(id, function (res) {
      $rootScope.detail = res.data.data;
      $rootScope.detail.atlas = JSON.parse($rootScope.detail.atlas);
      console.log($rootScope.detail);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }
});

//文章详情
mainApp.controller('articleController', function ($scope, $http, mainService, $sce) {

  function init() {
    var id = mainService.getQueryStringByName('id');
    getArticleById(id);
  }

  function getArticleById(id) {
    mainService.getDocumentById(id, function (res) {
      $scope.article = res.data.data;
      $scope.article.content = $sce.trustAsHtml($scope.article.content);
      console.log($scope.article);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }

  init();
});

//衍生品
mainApp.controller('derivativeController', function ($scope, $http, mainService, $rootScope) {
  var cid = mainService.getQueryStringByName('cid');
  $scope.option = {};
  $scope.getDocumentById = getDocumentById;
  $scope.getDocumentByCId = getDocumentByCId;
  $scope.option = {};
  init();

  function init() {
    getDocumentByCId(cid, 1, 10);
  }

  function getDocumentByCId(cid, pageIndex, pageSize) {
    mainService.getDocumentByCId(cid, pageIndex, pageSize, function (res) {
      $scope.list = res.data.data;
      $scope.option = {
        curr: $scope.list.currentPage,  //当前页数
        all: $scope.list.totalPages,  //总页数
        count: $scope.list.pageSize,  //最多显示的页数，默认为10

        //点击页数的回调函数，参数page为点击的页数
        click: function (page) {
          getDocumentByCId(cid, page);
          //这里可以写跳转到某个页面等...
        }
      };
      console.log($scope.list);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }

  function getDocumentById(id) {
    mainService.getDocumentById(id, function (res) {
      $rootScope.detail = res.data.data;
      $rootScope.detail.atlas = JSON.parse($rootScope.detail.atlas);
      console.log($rootScope.detail);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }
});

//作品详情
mainApp.controller('productDetailController', function ($scope, $http, mainService, $rootScope) {
  var id = mainService.getQueryStringByName('id');

  $scope.getDocumentById = getDocumentById;
  init();

  function init() {
    getDocumentById(id);
  }

  function getDocumentById(id) {
    mainService.getDocumentById(id, function (res) {
      $scope.detail = res.data.data;
      $scope.detail.atlas = JSON.parse($scope.detail.atlas);
      console.log($scope.detail);
    }, function (err) {
      console.log(JSON.stringify(err));
    })
  }
});

