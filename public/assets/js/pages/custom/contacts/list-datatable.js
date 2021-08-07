"use strict";
// Class definition

var KTAppsContactsListDatatable = function() {
    // Private functions

    // basic demo
    var _demo = function() {
        console.log(cash[0].details);
        var datatable = $('#kt_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: 'http://localhost:3000/api/account/getTransactions',
                    },
                },
                pageSize: 10, // display 20 records per page
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },

            // layout definition
            layout: {
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                footer: false, // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#kt_subheader_search_form'),
                delay: 400,
                key: 'generalSearch'
            },

            // columns definition
            columns: [{
                field: 'Date',
                title: 'Date',
                width: 80,
                type: 'date',
                format: 'MM/DD/YYYY',
                template: function(row) {
                    var output = '';
                    output += '<div class="font-weight-bolder text-primary mb-0">' + data.date + '</div>';
                    return output;
                },
            }
            , {
                field: 'OrderID',
                title: 'Narration',
                width: 300,
                template: function(data) {
                    

                    var output = '<div class="d-flex align-items-center">\
                        <div class="ml-4">\
                            <div class="text-dark-75 font-weight-bolder font-size-lg mb-0">' + data.details + '</div>\
                        </div>\
                    </div>';

                    return output;
                }
            }
            , {
                field: 'amount',
                title: 'Amount',
                template: function(row) {
                    var output = '';

                    output += '<div class="font-weight-bold text-muted">' + data.amount + '</div>';

                    return output;
                }
            }, {
                field: 'Status',
                title: 'Status',
                // callback function support for column rendering
                template: function(row) {
                    var status = {
                        
                        1: {
                            'title': 'Canceled',
                            'class': ' label-light-primary'
                        },
                        2: {
                            'title': 'Success',
                            'class': ' label-light-success'
                        },
                        
                    };
                    var xcr = 1;
                    return '<span class="label label-lg font-weight-bold ' + status[xcr].class + ' label-inline">' + 'Credit' + '</span>';
                },
            }]
        });
    };

    return {
        // public functions
        init: function() {
            _demo();
        },
    };
}();

jQuery(document).ready(function() {
    KTAppsContactsListDatatable.init();
});
