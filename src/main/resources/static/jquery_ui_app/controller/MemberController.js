var MemberController = {

    // Properties
    baseUrl: globalObject.apiUrl + '/v1/members/',
    pagingModel: {},
    viewMain: '#member-section',
    viewList: '#member-list',
    viewTable: '#member-table',
    viewEdit: '#member-edit',

    // Methods
    init: function () {
        this.$viewMain = $(this.viewMain);
        this.$viewList = $(this.viewList);
        this.$viewTable = $(this.viewTable);
        this.$viewEdit = $(this.viewEdit);
    },

    cancelEdit: function (event, $target) {
        this.$viewEdit.hide();
    },

    del: function (event, $target) {
        if (!confirm('Are you sure you want to delete?')) {
            return;
        }

        var me = this;
        var options = {};
        options['url'] = this.baseUrl + $target.data("id");
        options['httpMethod'] = 'DELETE',
        options['headers'] = Util.getSecurityTokenHeader();
        options['callback'] = function(result) {
            me.$viewEdit.hide();
            me.get(1);
        }
        RequestManager.doAjaxRequest(options);
    },

    first: function (event, $target) {
        NavigationUtil.goFirst(this);
    },

    get: function (pageIndex, pageSize) {
        var me = this;
        var $view = this.$viewList;
        var searchModel = $view.createModel();
        searchModel['name'] = $('[name=name]', this.$viewList).val();

        if (!pageIndex) {
            pageIndex = $('#page_index', this.$viewList).val();
        }
        searchModel['pageIndex'] = pageIndex;

        if (!pageSize) {
            pageSize = $('#page_size', this.$viewList).val();
        }
        searchModel['pageSize'] = pageSize;

        // TODO: validate model

        var options = {};
        options['url'] = this.baseUrl + 'search';
        options['headers'] = Util.getSecurityTokenHeader();
        options['data'] = searchModel,
        options['callback'] = function(data){
            // store paging model
            me.pagingModel = data;

            // render data to table
            me.$viewTable.empty();
            me.pagingModel.list.forEach(function(item, index) {
                me.$viewTable.append(
                    '<li>' +
                        me.toString(item) +
                        ' <a class="button" href="#/members/' + item.id + '">Update</a> ' +
                        ' <a class="button" data-action="del" data-id="' + item.id + '">Delete</a> ' +
                    '</li>');
            });

            // update UI paging components
            $('#page_index', me.$viewList).val(me.pagingModel.page_index);
            $('#num_of_pages', me.$viewList).text(me.pagingModel.num_of_pages);
        }
        RequestManager.doAjaxRequest(options);
    },

    index: function () {
        var $view = this.$viewMain;
        $.showSection(this, $view);
        $.updateSectionTitle($view);

        // globalObject.currentView.hide();
        // globalObject.currentView = this.$viewMain;
        // globalObject.currentView.show();
        // this.get();
    },

    last: function (event, $target) {
        NavigationUtil.goLast(this);
    },

    next: function (event, $target) {
        NavigationUtil.goNext(this);
    },

    onPageIndexChanged: function (event, $target) {
        NavigationUtil.onPageIndexChanged(event, $target, this);
    },

    onPageSizeChanged: function (event, $target) {
        NavigationUtil.onPageSizeChanged(event, $target, this);
    },

    previous: function (event, $target) {
       NavigationUtil.goPrevious(this);
    },

    save: function (event, $target) {       // update only, create by uploading csv file
        var me = this;

        // 1. disable target
        $target.setEnabled(false);

        // 2. validate view, if ok unbind data from GUI to model and validate it
        var $view = this.$viewEdit;

        // TODO: validate view
//        if ($view.validateForm()) {
//        }
        var model = $view.data('model');
        DataUtil.unbind($view, model);
//        if (model.validate(errors)) {
//        }
        // 3. prepare post data for AJAX request
        var options = {};
        options['url'] = this.baseUrl + model.id;
        options['httpMethod'] = 'PUT';
        options['headers'] = Util.getSecurityTokenHeader();
        options['data'] = model,
        options['callback'] = function(result){
            // 5. change view and do other stuffs
            $view.hide();
            document.location.hash = '#/members';

            // 6. enable target
            $target.setEnabled(true);
        }
        options['alwaysCallback'] = function(){
            $target.setEnabled(true);
        };

        // 4. call method to send request
        RequestManager.doAjaxRequest(options);
    },

    search: function (event, $target) {
        if (event.keyCode != 13) {
            return;
        }

        var pageIndex = $('#page_index', this.$viewList).val();
        var pageSize = $('#page_size', this.$viewList).val();
        this.get(pageIndex, pageSize);
    },

    sendMailsToAllMembers: function (event, $target) {
        var me = this;

        // 1. disable target
        $target.setEnabled(false);

        // 2. validate view, if ok unbind data from GUI to model and validate it
        var $view = this.$viewList;

        // TODO: validate view
//        if ($view.validateForm()) {
//        }
        var model = {};
        model.subject = $('[name=subject]', $view).val();
        model.content = $('[name=content]', $view).val();
        model.job = '';
//        if (model.validate(errors)) {
//        }
        // 3. prepare post data for AJAX request
        var options = {};
        options['url'] = this.baseUrl + 'sendmails';
        options['httpMethod'] = 'POST';
        options['headers'] = Util.getSecurityTokenHeader();
        options['data'] = model;
        options['callback'] = function(result){
            // 5. change view and do other stuffs
            alert('emails sent')

            // 6. enable target
            $target.setEnabled(true);
        }
        options['alwaysCallback'] = function(){
            $target.setEnabled(true);
        };

        // 4. call method to send request
        RequestManager.doAjaxRequest(options);
    },

    sendMailsToStudents: function (event, $target) {
        var me = this;

        // 1. disable target
        $target.setEnabled(false);

        // 2. validate view, if ok unbind data from GUI to model and validate it
        var $view = this.$viewList;

        // TODO: validate view
//        if ($view.validateForm()) {
//        }
        var model = {};
        model.subject = $('[name=subject]', $view).val();
        model.content = $('[name=content]', $view).val();
        model.job = 'Student';
//        if (model.validate(errors)) {
//        }
        // 3. prepare post data for AJAX request
        var options = {};
        options['url'] = this.baseUrl + 'sendmails';
        options['httpMethod'] = 'POST';
        options['headers'] = Util.getSecurityTokenHeader();
        options['data'] = model;
        options['callback'] = function(result){
            // 5. change view and do other stuffs
            alert('emails sent')

            // 6. enable target
            $target.setEnabled(true);
        }
        options['alwaysCallback'] = function(){
            $target.setEnabled(true);
        };

        // 4. call method to send request
        RequestManager.doAjaxRequest(options);
    },

    sendMailsToDevelopers: function (event, $target) {
        var me = this;

        // 1. disable target
        $target.setEnabled(false);

        // 2. validate view, if ok unbind data from GUI to model and validate it
        var $view = this.$viewList;

        // TODO: validate view
//        if ($view.validateForm()) {
//        }
        var model = {};
        model.subject = $('[name=subject]', $view).val();
        model.content = $('[name=content]', $view).val();
        model.job = 'Developer';
//        if (model.validate(errors)) {
//        }
        // 3. prepare post data for AJAX request
        var options = {};
        options['url'] = this.baseUrl + 'sendmails';
        options['httpMethod'] = 'POST';
        options['headers'] = Util.getSecurityTokenHeader();
        options['data'] = model;
        options['callback'] = function(result){
            // 5. change view and do other stuffs
            alert('emails sent')

            // 6. enable target
            $target.setEnabled(true);
        }
        options['alwaysCallback'] = function(){
            $target.setEnabled(true);
        };

        // 4. call method to send request
        RequestManager.doAjaxRequest(options);
    },

    toString: function (item) {
        return item.email + ' - ' + item.name + ' - ' + item.phone + ' - ' + item.job + ' - ' + item.company;
    },

    update: function (id) {
        var me = this;

        // 1. disable target
        // 2. prepare view to be showed
        var $view = this.$viewEdit;

        var options = {};
        options['url'] = this.baseUrl + id;
        options['httpMethod'] = 'GET',
        options['headers'] = Util.getSecurityTokenHeader();
        options['callback'] = function(entity){
            // 3.prepare model for the view
            var model = $view.createModel();
            model.update(entity);
            $view.data('model', model);					// set model to $view to use in save method

            // 4. bind model to view
            DataUtil.bind($view, model);

            // 5. do other stuffs and show the view
            $view.find('[name=email]').attr('disabled','disabled');   // don't allow update email
            $view.show();

            // 6. enable target
        }
        RequestManager.doAjaxRequest(options);
    }

}