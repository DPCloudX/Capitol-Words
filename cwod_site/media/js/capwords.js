var $j = jQuery.noConflict();

var CapitolWords = CapitolWords || {};

CapitolWords.states = {
    "WA": "Washington", "VA": "Virginia", "DE": "Delaware", 
    "DC": "District of Columbia", "WI": "Wisconsin", "WV": "West Virginia", 
    "HI": "Hawaii", "CO": "Colorado", "FL": "Florida", "WY": "Wyoming", 
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "TX": "Texas", 
    "LA": "Louisiana", "NC": "North Carolina", "ND": "North Dakota", "NE": "Nebraska", 
    "TN": "Tennessee", "NY": "New York", "PA": "Pennsylvania", "CA": "California", 
    "NV": "Nevada", "AA": "Armed Forces Americas", "PR": "Puerto Rico", "GU": "Guam", 
    "AE": "Armed Forces Europe", "VI": "Virgin Islands", "AK": "Alaska", "AL": "Alabama", 
    "AP": "Armed Forces Pacific", "AS": "American Samoa", "AR": "Arkansas", "VT": "Vermont", 
    "IL": "Illinois", "GA": "Georgia", "IN": "Indiana", "IA": "Iowa", "OK": "Oklahoma", 
    "AZ": "Arizona", "ID": "Idaho", "CT": "Connecticut", "ME": "Maine", "MD": "Maryland", 
    "MA": "Massachusetts", "OH": "Ohio", "UT": "Utah", "MO": "Missouri", "MN": "Minnesota", 
    "MI": "Michigan", "RI": "Rhode Island", "KS": "Kansas", "MT": "Montana", 
    "MP": "Northern Mariana Islands", "MS": "Mississippi", "SC": "South Carolina", 
    "KY": "Kentucky", "OR": "Oregon", "SD": "South Dakota"};

CapitolWords.customizeChart = function () {
    var party = $j("#partySelect").val();
    var state = $j("#stateSelect").val();
    var url = 'http://capitolwords.org/api/chart/timeline.json';
    $j.ajax({
        dataType: 'jsonp',
        url: url,
        data: {'party': party,                                                                            
               'state': state,                                                                            
               'phrase': $j("#term").val(),                                                                   
               'granularity': 'month',
               'percentages': 'true',
               'legend': 'false',
               'mincount': 0},
        success: function (data) {
            var results = data['results'];
            var imgUrl = results['url'];
            var imgTag = '<img src="' + imgUrl + '"/>';
            $j("#customChart").attr('src', imgUrl);
        }
    });
};

CapitolWords.getGraph = function (term) {
    url = 'http://capitolwords.org/api/chart/timeline.json'
    $j.ajax({
        dataType: 'jsonp',
        url: url,
        data: {
            'phrase': term,
            'granularity': 'month',
            'percentages': true,
            'mincount': 0,
            'legend': false
        },
        success: function (data) {
            var results = data['results'];
            var imgUrl = results['url'];
            var overallImgTag = '<img src="' + imgUrl + '" alt="Timeline of occurrences of ' + term + '"/>';
            var customImgTag = '<img id="customChart" src="' + imgUrl + '" alt="Custom timeline of occurrences of ' + term + '"/>';
            $j("#overallTimeline").html(overallImgTag);
            $j("#customTimeline").append(customImgTag);
        }
    });
};

CapitolWords.getPartyGraph = function (term) {
    url = 'http://capitolwords.org/api/chart/timeline.json'
    $j.ajax({
        dataType: 'jsonp',
        url: url,
        data: {
            'phrase': term,
            'granularity': 'month',
            'percentages': true,
            'mincount': 0,
            'legend': true,
            'split_by_party': true,
        },
        success: function (data) {
            var results = data['results'];
            var imgUrl = results['url'];
            var imgTag = '<img src="' + imgUrl + '" alt="Timeline of occurrences of ' + term + '"/>';
            $j("#partyTimeline").html(imgTag);
        }
    });
};

CapitolWords.getPartyPieChart = function (term, div, width, height) {
    if (typeof width === 'undefined') {
        width = '';
    }
    if (typeof height === 'undefined') {
        height = '';
    }
    url = 'http://capitolwords.org/api/chart/pie.json';
    $j.ajax({
        dataType: 'jsonp',
        url: url,
        data: {
            'phrase': term,
            'entity_type': 'party',
            'width': width,
            'height': height
        },
        success: function (data) {
            var results = data['results'];
            var imgUrl = results['url'];
            var imgTag = '<img src="' + imgUrl + '" alt="Pie chart of occurrences of ' + term + ' by party" style="border: 0;"/>';
            div.html(imgTag);
        }
    });
};

CapitolWords.addLegislatorToChart = function (result, maxcount, div) {
    url = 'http://capitolwords.org/api/legislators.json';
    var bioguide_id = result['legislator'];
    var pct = (result['count'] / maxcount) * 100;
    $j.ajax({
        dataType: 'jsonp',
        url: url,
        async: false,
        data: {
            'bioguide_id': bioguide_id
        },
        success: function (data) {
            var url = '/legislator/' + bioguide_id + '-' + data['slug'];
            var html = '';
            html += '<li>';
            html += '<span class="tagValue" style="width:' + pct + '%;">';
            html += '<span class="tagPercent">' + pct + '%</span>';
            html += '<span class="tagNumber"></span>';
            html += '</span>';
            html += '<span class="barChartTitle"><a href="' + url + '">';
            html += data['honorific'] + ' ';
            html += data['full_name'] + ', ';
            html += data['party'] + '-' + data['state'];
            html += '</a></span>';
            html += '</li>';
            div.append(html);
        }
    });
};

CapitolWords.getLegislatorPopularity = function (term, div) {
    url = 'http://capitolwords.org/api/phrases/legislator.json';
    $j.ajax({
        dataType: 'jsonp',
        url: url,
        data: {
            'phrase': term,
            'sort': 'relative',
            'per_page': 10
        },
        success: function (data) {
            var results = data['results'];
            var maxcount = results[0]['count'];
            div.html('');
            for (i in results) {
                var result = results[i];
                CapitolWords.addLegislatorToChart(result, maxcount, div);
            }
        }
    });
};

CapitolWords.getStatePopularity = function (term, div) {
    url = 'http://capitolwords.org/api/phrases/state.json';
    $j.ajax({
        dataType: 'jsonp',
        url: url,
        data: {
            'phrase': term,
            'sort': 'relative',
            'per_page': 10
        },
        success: function (data) {
            div.html('');
            var results = data['results'];
            var maxcount = results[0]['count']
            for (i in results) {
                var result = results[i];
                var abbrev = result.state;
                var state = abbrev;
                if (CapitolWords.states.hasOwnProperty(state)) {
                    state = CapitolWords.states[state];
                }
                var url = '/state/' + abbrev;
                var pct = (result['count'] / maxcount) * 100;
                var html =  '';
                html += '<li>';
                html += '<span class="tagValue" style="width:' + pct + '%;">';
                html += '<span class="tagPercent">' + pct + '%</span>';
                html += '<span class="tagNumber"></span>';
                html += '</span>';
                html += '<span class="barChartTitle"><a href="' + url + '">' + state + '</a></span>';
                html += '</li>';
                div.append(html);
            }
        }
    });
};

CapitolWords.populateTermDetailPage = function (term) {
    this.getGraph(term);
    this.getStatePopularity(term, $j("#stateBarChart"));
    this.getPartyPieChart(term, $j("#partyPieChart"));
    this.getLegislatorPopularity(term, $j("#legislatorBarChart"));
    this.getPartyGraph(term);
};

CapitolWords.compare = function (toCompare) {
    var url = 'http://capitolwords.org/api/chart/timeline.json';
    var terms = [];
    var parties = [];
    var states = [];
    var item;
    for (i in toCompare.slice(0, 3)) {
        item = toCompare[i];
        terms.push(item.term || '');
        parties.push(item.party || '');
        states.push(item.states || '');
    }
    terms = terms.join(',');
    parties = parties.join(',');
    states = states.join(',');
    $j.ajax({
        dataType: 'jsonp',
        url: url,
        data: {
            'phrases': terms,
            'parties': parties,
            'states': states,
            'granularity': 'month',
            'percentages': true,
            'mincount': 0,
            'compare': true,
            'width': 800
        },
        success: function (data) {
            var results = data['results'];
            var imgUrl = results['url'];
            //$j("#chart").html('<img src="' + imgUrl + '"/>');
            $j("#chart img").attr("src", imgUrl);
        }
    });
};

CapitolWords.submitCompareForm = function () {
    var item;
    var items = [];
    var divs = ['a', 'b', 'c'];
    var div;

    for (i=0; i<3; i++) {
        element = $j("#term" + divs[i]);
        if (element.val() && element.val() != 'Word/phrase') {
            items.push({'term': element.val()})
        }
    }
    
    /*
    (function (window, undefined) {
        var History = window.History;
        if (!History.enabled) {
            return false;
        }

        var buildUrl = function (items) {
            var urlPieces = [];
            var item;
            var piece;

            for (i in items) {
                item = items[i];
                piece = [];
                piece.push(escape(item.term || ''));
                piece.push(escape(item.party || ''));
                piece.push(escape(item.state || ''));
                urlPieces.push(piece.join(':'));
            }
            return urlPieces.join('/');
        };
        History.pushState({state: 1}, "State 1", buildUrl(items));
        window.console.log(buildUrl(items));

     })(window);
     */

    CapitolWords.compare(items);

    for (i in items) {
        item = items[i];        
        div = divs[i];
        CapitolWords.getPartyPieChart(item['term'], $j("#" + div + " .partyPieChart"), 220, 150);
        //CapitolWords.getStatePopularity(item['term'], $j("#" + div + " .stateBarChart"));
        //CapitolWords.getLegislatorPopularity(item['term'], $j("#" + div + " .legislatorBarChart"));
    }
};


$j(document).ready(

        function () {

            if (typeof termDetailTerm !== 'undefined') {
                CapitolWords.populateTermDetailPage(termDetailTerm);
            }

            // Hide broken images.
            $j("img").error(function(){
                $j(this).hide();
            });

            // Change which ngram list is shown.
            $j(".ngramMenu li").bind('click', function (x) {
                var classToShow = $j(this).attr('class');
                $j(".barChart:visible").hide(0, function () {
                    $j("ol#" + classToShow).show(0);
                });
            });

            // Change which timeline is shown.
            $j("#timelineToggle input").bind('click', function () {
                var selectedId = $j('input[name=toggle]:checked', '#timelineToggle').attr('id');
                if (selectedId === 'overallTimelineSelect') {
                    $j("#partyTimeline").hide();
                    $j("#customTimeline").hide();
                    $j("#overallTimeline").show();
                } else if (selectedId === 'partyTimelineSelect') {
                    $j("#overallTimeline").hide();
                    $j("#customTimeline").hide();
                    $j("#partyTimeline").show();
                } else if (selectedId === 'customTimelineSelect') {
                    $j("#overallTimeline").hide();
                    $j("#partyTimeline").hide();
                    $j("#customTimeline").show();
                }
            });

            $j("#partySelect, #stateSelect").change(function () {
                CapitolWords.customizeChart();
            });

            $j(".compareSubmit").bind('click', function () {
                CapitolWords.submitCompareForm();
            });

            $j("#termSelect input").bind('keyup', function (e) {
                if (e.keyCode === 13) {
                    CapitolWords.submitCompareForm();
                }
            });

            $j("#termSelect input").bind('focus', function () {
                if ($j(this).val() == 'Word/phrase') {
                    $j(this).val('');
                }
            });
            $j("#termSelect input").bind('blur', function () {
                if ($j(this).val() == '') {
                    $j(this).val('Word/phrase');
                }
            });


    }

);
