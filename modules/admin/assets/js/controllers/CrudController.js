function openMore( $more ) {
    var $editWrapper = $more.find( '.Crud-editWrapper' );

    $more.addClass( 'is-open' );
    if( $editWrapper.length > 0 )
        $more = $editWrapper;
}

function closeMore( $more ) {
    var $editWrapper = $more.find( '.Crud-editWrapper' );

    $more.removeClass( 'is-open' );
    if( $editWrapper.length > 0 ) {
        $more = $editWrapper;
    }

}

zaa.controller("CrudController", function($scope, $http, $sce) {
	
	$scope.init = function () {
		$scope.loadList();
	}
	
	$scope.debug = function() {
		console.log('config', $scope.config);
		console.log('data', $scope.data);
	}
	/*
	$scope.submitStrap = function(strapHash) {
		console.log(strapHash);
	}
	
	$scope.postStrapUrl = function(callback, params) {
		console.log(callback, params);
	}
	*/
	$scope.getStrap = function (strapId, id, $event) {
		$http.post('admin/ngrest/render', $.param({ itemId : id, strapHash : strapId , ngrestConfigHash : $scope.config.ngrestConfigHash }), {
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(data) {
			$scope.toggler.update = false;
			$scope.toggler.strap = true;
			$scope.data.strap.id = strapId;
			$scope.data.strap.content = $sce.trustAsHtml(data);
			
			/* move tr */

            var $tr     = $($event.currentTarget).parents( 'tr');
            var $edit   = $tr.next( '.Crud-more' );

            if( $edit.length <= 0 ) {
                $edit = $( '.Crud-more' );

                if( $edit.hasClass( 'is-open' ) ) {
                    closeMore( $edit );

                    setTimeout( function() {
                        $edit.insertAfter( $tr );
                        openMore( $edit );
                    }, 10);
                } else {
                    $edit.insertAfter( $tr );
                    openMore( $edit );
                }
            } else {
                openMore( $edit );
            }
			
			/*// move tr */
			
		})
	}

	$scope.toggleUpdate = function (id, $event) {
		$scope.toggler.update = true;
		$scope.data.updateId = id;
		$http.get($scope.config.apiEndpoint + '/'+id+'?fields=' + $scope.config.update.join())
		.success(function(data) {
			$scope.toggler.strap = false;
			$scope.data.update = data;
			
			
			/* move tr */

             var $tr     = $($event.currentTarget).parents( 'tr');
             var $edit   = $tr.next( '.Crud-more' );

             if( $edit.length <= 0 ) {
                 $edit = $( '.Crud-more' );

                 if( $edit.hasClass( 'is-open' ) ) {
                     closeMore( $edit );

                     setTimeout( function() {
                         $edit.insertAfter( $tr );
                         openMore( $edit );
                     }, 10);
                 } else {
                     $edit.insertAfter( $tr );
                     openMore( $edit );
                 }
             } else {
                 openMore( $edit );
             }
			
			/*// move tr */
             
             dispatchEvent('onCrudUpdate');
			
		})
		.error(function(data) {
			alert('ERROR LOADING UPDATE DATA');
		})
	}
	
	$scope.toggleCreate = function () {
		$scope.toggler.create = !$scope.toggler.create;
		if ($scope.toggler.create) {
			dispatchEvent('onCrudCreate');
		}
	}

	$scope.submitUpdate = function () {
		$http.put($scope.config.apiEndpoint + '/' + $scope.data.updateId, $.param($scope.data.update), {
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(data) {
			$scope.loadList();
		})
		.error(function(data) {
			alert('ERROR UPDATE DATA ' + $scope.data.updateId);
		})
	}
	
	$scope.submitCreate = function() {
		$http.post($scope.config.apiEndpoint, $.param($scope.data.create), {
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(data) {
			$scope.loadList();
			$scope.data.create = {};
		})
		.error(function(data) {
			for (var i in data) {
				field = data[i]['field'];
				message = data[i]['message'];
				alert('Fehler: Feld:' +field+' meldet "' + message + '"');
			}
		})
	}

	$scope.loadList = function() {
		$http.get($scope.config.apiEndpoint + '?fields=' + $scope.config.list.join())
		.success(function(data) {
			$scope.data.list = data;
		})
	}
	
	$scope.toggler = {
		create : false,
		update : false
	}
	
	$scope.data = {
		create : {},
		update : {},
		strap : {},
		list : {},
		updateId : 0
	};
	
	$scope.config = {};
	
});