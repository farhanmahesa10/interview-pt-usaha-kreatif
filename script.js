const app = angular.module("xapp", []);

app.controller("xctrl", ($scope) => {
  $scope.categories = {
    show: false,
    data: categories,
  };
  $scope.showFilter = false;
  $scope.sizes = {
    show: false,
    data: sizes,
  };
  $scope.displayedProducts = products.slice(0, 12);
  $scope.choosenCategory = "";
  $scope.selectedSizes = [];
  $scope.pagination = {
    activePage: 1,
    perPage: 12,
    pages: [],
  };
  $scope.prices = {
    show: true,
    minPrice: 0,
    maxPrice: 10000,
    min: 0,
    max: 10000,
    minthumb: 0,
    maxthumb: 0,
  };
  $scope.sortState = {
    show: false,
    active: "Price",
    sorts: sorts,
  };

  const changeDisplayedProducts = () => {
    const filltered = products.filter((r) => {
      return (
        r.category
          ?.toLowerCase()
          .includes($scope.choosenCategory?.toLowerCase() || "") &&
        r.name?.toLowerCase().includes($scope.search?.toLowerCase() || "") &&
        r.price > $scope.prices.minPrice &&
        r.price < $scope.prices.maxPrice &&
        ($scope.selectedSizes.length > 0
          ? $scope.selectedSizes.find((res) => res.name === r.size)
          : true)
      );
    });
    const sortResult = _.sortBy(
      filltered,
      $scope.sortState.active.toLowerCase()
    );
    // console.log(_.slice(sortResult, 0, 12));
    // $scope.displayedProducts = sortResult;
    $scope.displayedProducts = sortResult.slice(
      $scope.pagination.perPage * $scope.pagination.activePage -
        $scope.pagination.perPage,
      $scope.pagination.perPage * $scope.pagination.activePage
    );
    $scope.pagination.pages = [];
    for (
      let pageNumber = 1;
      pageNumber <= Math.ceil(sortResult.length / $scope.pagination.perPage);
      pageNumber++
    ) {
      if (Math.ceil(sortResult.length / $scope.pagination.perPage) > 1) {
        $scope.pagination.pages.push(pageNumber);
      }
    }
  };

  $scope.$watch("search", (newValue, oldValue) => {
    changeDisplayedProducts();
  });
  $scope.handleChangePage = (page) => {
    $scope.pagination.activePage = page;
    changeDisplayedProducts();
  };

  $scope.handleCategoryChange = (value) => {
    $scope.choosenCategory = value;
    changeDisplayedProducts();
  };

  $scope.categoryChanged = () => {
    console.log("Selected Category:", $scope.selectedCategory);
    // Perform additional actions based on the selected category
  };

  $scope.sizeChanged = (size) => {
    if (size.selected) {
      $scope.selectedSizes.push(size);
    } else {
      $scope.selectedSizes = $scope.selectedSizes.filter(
        (r) => r.name !== size.name
      );
    }
    changeDisplayedProducts();
  };

  $scope.sortChange = (sort) => {
    $scope.sortState.show = false;
    $scope.sortState.active = sort;
    changeDisplayedProducts();
  };

  $scope.mintrigger = () => {
    $scope.prices.minPrice = Math.min(
      $scope.prices.minPrice,
      $scope.prices.maxPrice - 500
    );
    $scope.prices.minthumb =
      (($scope.prices.minPrice - $scope.prices.min) /
        ($scope.prices.max - $scope.prices.min)) *
      100;
    changeDisplayedProducts();
  };

  $scope.maxtrigger = () => {
    $scope.prices.maxPrice = Math.max(
      $scope.prices.maxPrice,
      $scope.prices.minPrice + 500
    );
    $scope.prices.maxthumb =
      100 -
      (($scope.prices.maxPrice - $scope.prices.min) /
        ($scope.prices.max - $scope.prices.min)) *
        100;

    changeDisplayedProducts();
  };
});
