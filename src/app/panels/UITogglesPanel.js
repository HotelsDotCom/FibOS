/**
 * Created by fdimonte on 23/02/2015.
 */

var UITogglesPanel = (function($,UIExtraPanel){

    /**
     * UITogglesPanel Class
     *
     * @constructor
     * @param id
     */
    function UITogglesPanel(id) {

        var baseID = 'fib_toggle';
        this._selectors = {
            base    : baseID,
            main    : baseID + '-main',
            spacers : baseID + '-spacers',
            overlay : baseID + '-overlay',
            rulers  : baseID + '-rulers',
            markers : baseID + '-markers'
        };

        UIExtraPanel.call(this,id);
    }

    /**
     * UITogglesPanel prototype
     *
     * @type {UIBasePanel}
     */
    UITogglesPanel.prototype = Object.create(UIExtraPanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UITogglesPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<div/>').attr('id',this._selectors.main))
            .append(toggleCheckbox.call(this,this._selectors.spacers,'toggle spacers',true))
            .append(toggleCheckbox.call(this,this._selectors.overlay,'toggle overlay',false))
            .append(toggleCheckbox.call(this,this._selectors.rulers, 'toggle rulers',false))
            .append(toggleCheckbox.call(this,this._selectors.markers,'toggle marker tool',false));

        return $content.children();
    };

    UITogglesPanel.prototype.setEvents = function() {

        this.addListener('click',  '#'+this._selectors.main, function(e){this.trigger('toggle_fibos');});

        this.addListener('change', '#'+this._selectors.spacers+' .fib-checkbox', checkbox_handler.call(this,'toggle_spacers'));
        this.addListener('change', '#'+this._selectors.overlay+' .fib-checkbox', checkbox_handler.call(this,'toggle_overlay'));
        this.addListener('change', '#'+this._selectors.rulers +' .fib-checkbox', checkbox_handler.call(this,'toggle_rulers') );
        this.addListener('change', '#'+this._selectors.markers+' .fib-checkbox', checkbox_handler.call(this,'toggle_markers'));

    };

    UITogglesPanel.prototype.getStyles = function() {
        var styles = {};

        styles['.'+this._selectors.base] = {
            background:'rgba(100,100,100,.4)',
            'border-top':'1px solid #fff',
            height:'21px',
            position:'absolute',
            right:'-21px',
            width:'21px'
        };

        styles['#'+this._selectors.main] = {
            background:'rgba(100,100,100,0.4)',
            cursor:'pointer',
            height:'34px',
            position:'absolute',
            right:'-13px',
            width:'13px'
        };

        styles['#'+this._selectors.main+':hover'] = {
            background:'rgba(100,100,100,1)'
        };

        styles['#'+this._selectors.main+':after'] = {
            color:'#fff',
            content:'"«"',
            left:'2px',
            position:'absolute',
            top:'5px'
        };

        styles['.hidden #'+this._selectors.main+':after'] = {
            content:'"»"'
        };

        styles['#'+this._selectors.spacers] = {top:'34px'};
        styles['#'+this._selectors.overlay] = {top:'55px'};
        styles['#'+this._selectors.rulers]  = {top:'76px'};
        styles['#'+this._selectors.markers] = {top:'97px'};

        return styles;
    };

    /********************
     * PUBLIC METHODS
     ********************/

    UITogglesPanel.prototype.getStateOf = function(toggle) {
        if(!this._selectors[toggle]) return null;
        return $('#'+this._selectors[toggle]).find('.fibo_checkbox').is(':checked');
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function checkbox_handler(event){
        return function(e){
            this.trigger(event, $(e.currentTarget).is(':checked'));
        }.bind(this);
    }

    function toggleCheckbox(cont_id,title,checked) {
        var labid = cont_id+'-checkbox',

            $checkbox = this.getBaseElement('checkbox','circle').attr('id',labid).prop('checked',checked),

            $container = $('<div/>')
                .attr('id',cont_id)
                .addClass(this._selectors.base),

            $label = $('<label/>')
                .attr('for',labid)
                .attr('title',title)
                .html('&nbsp;');

        return $container.append($checkbox).append($label);
    }

    return UITogglesPanel;

}(jQuery,UIExtraPanel));
