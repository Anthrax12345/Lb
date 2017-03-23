// Module to get MyApp.
var app = angular.module("MyApp", ["ngRoute", 'ngMaterial', 'ngMessages']);

// Routing.
app.config(["$routeProvider", function($routeProvider)
{
	
	$routeProvider.when("/addnewbook", {
		templateUrl: "addnewbook.html"
		
	}).when("/addnewauthor", {
		templateUrl: "addnewauthor.html",
		
	}).when("/", {
		templateUrl: "homepage.html",
		
	}).when("/authordetails", {
		templateUrl: "authordetails.html"
	}).when("/bookdetails", {
		templateUrl: "bookdetails.html"
	})
	
}
]);

	/*** Service Object ****/
// Service which asct as singleton object to do manipulation
// in libary object.
app.service("libaryService",[ function () {
	this.libary = "";				// Contains whole JSON data.
	this.authors = "";				// Authors for libary.
	this.books = "";				// Books in libary.
	this.selectedBook = "";			// Current user selected book.
	this.selectedAuthor = "";		// Current user selected author.
	
	// returns a single book based on ISBN  of books.
	this.getBook = function(ISBN)
	{
		if(typeof ISBN === "object")
		{
			ISBN = ISBN.ISBN;
		}		
		for(let i = 0; i < this.books.length; i++)
		{
			if(this.books[i].ISBN == ISBN)
			{
				return this.books[i];
			}
		}
		return "no Books found"; 
	}
	// returns a single author based on id of authors.
	this.getAuthor = function(id)
	{
			id = parseInt(id);
		for(let i = 0; i < this.authors.length; i++)
		{
			if(this.authors[i].Id == id){
				return this.authors[i];
			}
				
		}
		return "No author present";
	}
	
	// Returns true if duplicate isbn is found.
	this.checkISBN = function(Book)
	{
		var isbn = "";
		if(typeof Book === "object")
		{
			isbn = Book.ISBN;
		}
		else{
			isbn = Book;
		}
		for(let i =0; i < this.books.length; i++)
		{
			if(this.books[i].ISBN == isbn)
			{
				return true;
			}
		}
		return false;
	}
	
	// Add one single object of book ISBN must be unique.
	// return true if adding books is success.
	this.addBook = function(newBook)
	{
		if(this.checkISBN == true)
		{
			return false;
		} 
		else{
			this.books.push(newBook);
			return true;
		}
		
		//TODO AJAX CALL TO SAVE DATA AT SERVER.
	}
	
	//Add one single object of author.
	this.addAuthor = function(newAuthor)
	{
		this.authors.push(newAuthor);
		//TODO AJAX CALL TO SAVE DATA AT SERVER.
	}
	this.generateAuthorId = function()
	{
		let idarray = [];
		let id = 0;
		for( let i = 0; i< this.authors.length; i++)
		{
			idarray.push(parseInt(this.authors[i].Id));
		}
		idarray.sort();
		id = idarray[idarray.length -1] + 1;
		return id;
		
	}
	// Delete one single object of author.
	this.deleteAuthor = function(id){
		for(let i = 0; i < this.authors.length; i++)
		{
			if(this.authors[i].Id == id){
				this.authors.splice(i, 1);
				return;
			}
		}
		return "No author present";
	}
	
	// Delete one single object of book.
	this.deleteBook = function(ISBN){
		for(let i = 0; i < this.books.length; i++)
		{
			if(this.books[i].ISBN === ISBN)
			{
				this.books.splice(i, 1);
				return;
			}
		}
		return "No such books";
	
	}
	
}]);


//Directive for tag ank-search-table.
app.directive("ankSearchTable", function()
{
	return {
		restrict: 'E',
		templateUrl: "tablecontent.html"
	}
}
);

// Parent Controller. It basic work is to do ajax call and intialize libaryService.
// $http for XMLhttpRequest. libartService is service which act a medium to communicate 
// between different controller.
app.controller("mainController",["$scope","libaryService","$http","$mdDialog", function($scope, libaryService, $http, $mdDialog)
{
	// First we make XMLhttpRequest.
	$http({
		method: 'GET',
		url: '/data.json'
		}).then(function successCallback(response) {
			
			libaryService.libary = response.data;
			libaryService.authors = response.data.libary.Authors;
			libaryService.books = response.data.libary.Books;
		}, function errorCallback(response) {
			libaryService.libary = response;
	});
	
	// For tabpanel.
	$scope.links = ['active', '', ''];
	$scope.linksClicked = function(id)
	{
		for(let i = 0; i <$scope.links.length; i++)
		{
			if(id === i)
				$scope.links[i] = 'active';
			else
				$scope.links[i] = '';
		}
	}
}
]);


		/**************HOME PAGE CONTROLLER *******************/	
app.controller("homepagecontroller",["$location", "$scope", "libaryService", function($location, $scope, libaryService)
{
	// $scope.tablecontent consist of all data which would be needed to
	// to display table on homepage. We make deep copy of whole json books object.
	// After that we add authorname to tablecontent so that angularjs search filter
	// can see it. This is part of controller because we want our tablecontent to 
	// be loaded again whenever page is requested.
		$scope.tablecontent = angular.copy(libaryService.books);
		for(let i = 0; i < libaryService.books.length; i++)
		{
		
			$scope.tablecontent[i].AuthorName = libaryService.getAuthor($scope.tablecontent[i].authorId).AuthorName;
			if($scope.tablecontent[i].AuthorName == undefined)
			{
				$scope.tablecontent[i].AuthorName = "No Author Found";
			}
		}	
		
	// Functions for BookDetails and Author details.
	
	//event consist of recent event object. We use it to get id from event.
	$scope.bookDetails = function(event){
		// for chrome srcElement and for mozilla and IE target.
		var id = parseInt(event.target.id || event.srcElement.id);
		libaryService.selectedBook = libaryService.getBook(id);
	}
	
	$scope.authorDetails = function(event){
		var id = parseInt(event.target.id || event.srcElement.id);
		libaryService.selectedAuthor = libaryService.getAuthor(id);
	}
	
	// for css
	var bottom = 'glyphicon glyphicon-triangle-bottom';
	var up = 'glyphicon glyphicon-triangle-top';
	$scope.thIcon = ['glyphicon glyphicon-triangle-bottom', '', ''];
	$scope.sortOrder = 'ISBN';
	$scope.direction = '';
	$scope.thClicked = function(i, k){
		$scope.sortOrder = k; 
		$scope.direction = $scope.direction ==''? 'reverse': '';
		$scope.thIcon[i] = $scope.thIcon[i] === bottom? up:bottom;
		for(let l = 0; l < $scope.thIcon.length; l++)
		{
			if(l != i)
			{
				$scope.thIcon[l] = "";
			}
			
		}
	}
}
]);

	/*************** 	Author Details Controller. *********/
app.controller("authordetailscontroller", ["$scope","$location", "$mdDialog", "libaryService", function($scope, $location, $mdDialog, libaryService)
{
	$scope.author = libaryService.selectedAuthor;
	$scope.newauthor = angular.copy($scope.author); 			// For deep copy.
	
	
	$scope.saveDetails = function(){
		//copy data to authors.
		$scope.author.AuthorName = $scope.newauthor.AuthorName;
		$scope.author.Email = $scope.newauthor.Email;
		$scope.author.Department = $scope.newauthor.Department;
		$scope.author.Website = $scope.newauthor.Website;
		$scope.author.Skills = $scope.newauthor.Skills;
	}
	$scope.deleteAuthor = function(ev){
		
		// Material Dialogbox.
		 var confirm = $mdDialog.confirm()
          .title('Would you like to delete Author: ' + $scope.author.AuthorName+' ?')		// title of dialog box.
          .textContent('Some of book may still have author with same name.')				// content of dialog box.
          .ariaLabel('Deleting Author') // used for accesibility.
          .targetEvent(ev)				// event object.
          .ok('Delete Author')			// ok button text.
          .cancel('Cancel ');			// cancel button text.

		$mdDialog.show(confirm).then(function() {
			libaryService.deleteAuthor(parseInt($scope.author.Id));
			$location.path('/');		// redirecting to homepage.
		}, function() {
			// Do nothing .
		});
  };
}]);

/*************** 	Book Details Controller. *********/
app.controller("bookdetailscontroller", ["$location", "$mdDialog", "$scope", "libaryService", function($location, $mdDialog, $scope, libaryService)
{
	
	$scope.book = libaryService.selectedBook;
	
	$scope.book.availableOn = new Date($scope.book.availableOn);
	$scope.newAuthorId = parseInt($scope.book.authorId);
	$scope.authors = libaryService.authors;
	$scope.authorName = libaryService.getAuthor($scope.book.authorId).AuthorName;
	$scope.editbook = angular.copy($scope.book); 			// For deep copy.
	$scope.editbook.availableOn = new Date();
	$scope.date1 = new Date();
	$scope.minDate = new Date($scope.date1.getFullYear(),$scope.date1.getMonth(), $scope.date1.getDate());
	$scope.saveDetails = function(){
		
		$scope.book.authorId = parseInt($scope.newAuthorId);
		// $scope.book.ISBN = parseInt($scope.newbook.ISBN);
		$scope.book.BookTitle = $scope.editbook.BookTitle;
		$scope.book.price = $scope.editbook.price;
		$scope.book.availableOn = $scope.editbook.availableOn;
		
		$http({
		method: 'PUT',
		data: libaryService,
		url: '/data2.json'
		}).then(function successCallback(response) {
			abc = response.data;
			libaryService.libary = response.data;
			libaryService.authors = response.data.libary.Authors;
			libaryService.books = response.data.libary.Books;
		}, function errorCallback(response) {
			libaryService.libary = response;
	});
	}

	$scope.deleteBook = function(ev){
		
		 var confirm = $mdDialog.confirm()
          .title('Would you like to delete Book: ' + $scope.book.BookTitle+' ?')
          .textContent('Once Delete this book cannot be retrieve back')
          .ariaLabel('Deleting Book')
          .targetEvent(ev)
          .ok('Delete book')
          .cancel('Cancel ');

    $mdDialog.show(confirm).then(function() {
      libaryService.deleteBook($scope.book.ISBN);
	  $location.path('/');
    }, function() {
		// Do nothing .
    });
  };
	
}]);

/*************** 	Add new Book  Controller. *********/
app.controller("newbookcontroller",["$location", "$scope", "libaryService", function($location, $scope, libaryService)
{
	$scope.newBook = {};		// Emty object for view.
	$scope.newBook.availableOn = new Date();
	$scope.duplicateISBN = false;
	// Fetching authors detail from authors to populate select option.
	$scope.authors = libaryService.authors; 
	
	$scope.date1 = new Date();
	$scope.minDate = new Date($scope.date1.getFullYear(),$scope.date1.getMonth(), $scope.date1.getDate());
	// Function called add Book link.
	$scope.addBook = function()
	{
		if(libaryService.addBook($scope.newBook) == false)
		{
			alert("ISBN already present");
		}
		else{
			$location.path('/');
		}
	}
	$scope.checkISBN = function()
	{
		if(libaryService.checkISBN($scope.newBook.ISBN) == true)
		{
			$scope.duplicateISBN = true;
		}
		else{
			$scope.duplicateISBN = false;
		}
		
	}
	$scope.bookRedirect = function()
	{
		libaryService.selectedBook = libaryService.getBook($scope.newBook.ISBN);
	}
	
}
]);

/*************** 	Add new Author  Controller. *********/
app.controller("addnewauthorcontroller",['$location', "$scope","libaryService",  function($location, $scope, libaryService)
{
	$scope.newAuthor = {}; 			// Emty object for view.

	// Auto generating index number for new author.
	$scope.newAuthor.Id = libaryService.generateAuthorId();
	
	// function called when add Author link is clicked.
	$scope.addAuthor = function()
	{
		libaryService.addAuthor($scope.newAuthor);
		$location.path('/');
	}
	
}
]);




