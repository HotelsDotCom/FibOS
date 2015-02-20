var jsonRenderer = (function JsonRenderer(){
   
   var _obj = {};
   var $row = $('<div class="t-row"/>');
   var $cel = $('<div class="t-cell"/>');
   
   // LOAD JSON DATA
   function public_load(jsonFile){
      var filename = 'data/'+jsonFile+'.json';
      $.post(filename,{},loaded,'json');
   }
   function loaded(data,textStatus,jqXHR){
      render(data);
   }
   
   // FULL RENDER METHOD
   function render(data){
      renderHeading(data.name);
      renderDescription(data.description);
      renderUsage(data.usage);
      renderProperties(data.properties);
      renderMethods(data.methods);
      renderExample(data.example);
   }
   
   // RENDER METHODS
   function renderHeading(name){
      $('#view h1').eq(0).text(name);
      $('title').eq(0).text(name);
   }
   function renderDescription(data){
      var $cont = $('#description').html(wrapIn('h2','description'));
      $cont.append(wrapIn('p','Type: ' + wrapIn('i',data.type)));
      $cont.append(wrapIn('p',data.text.split('\n').join('<br/>')));
   }
   function renderUsage(data){
      var $cont = $('#usage').html(wrapIn('h2','usage'));
      $cont.append(wrapIn('p',data.text.split('\n').join('<br/>')));
      $cont.append(renderTable('usage',data.list));
   }
   function renderProperties(data){
      var $cont = $('#properties').html(wrapIn('h2','properties'));
      $cont.append(wrapIn('p',data.text.split('\n').join('<br/>')));
      $cont.append(renderTableSingleCell('properties',data.list));
   }
   function renderMethods(data){
      var $cont = $('#methods').html(wrapIn('h2','methods'));
      $cont.append(wrapIn('p',data.text.split('\n').join('<br/>')));
      $cont.append(renderTable('methods',data.list));
   }
   function renderExample(data){
      var $cont = $('#example').html(wrapIn('h2','example'));
      $cont.append(wrapIn('pre',wrapIn('code',data.split('\n').join('<br/>'))));
   }
   
   // INTERNAL METHODS
   function wrapIn(tag,text){
      return $('<'+tag+'/>').html(text).prop('outerHTML');
   }
   function renderTable(id,list){
      var $tab = $('<div id="table-'+id+'"/>');
      var prop,value,$proprow,desc;
      for(prop in list){
         value = list[prop];
         desc = value[1].split('\n').join('<br\>');
         $proprow = $row.clone();
         $proprow.append($cel.clone().html(wrapIn('p',wrapIn('code',prop))));
         $proprow.append($cel.clone().html(wrapIn('p',wrapIn('code',value[0]))));
         $proprow.append($cel.clone().html(wrapIn('p',desc)));
         $tab.append($proprow);
      }
      return $tab;
   }
   function renderTableSingleCell(id,list){
      var $tab = $('<div id="table-'+id+'"/>');
      var prop,value,$proprow,$propcel,proplist,desc;
      for(prop in list){
         value = list[prop];
         desc = value[2].split('\n').join('<br>');
         $proprow = $row.clone();
         $propcel = $cel.clone();
         $propcel.append(wrapIn('p',' ('+value[0]+') ' + wrapIn('strong',prop) ) );
         $propcel.append(wrapIn('p',desc));
         $propcel.append(wrapIn('p','Default: ' + wrapIn('code',value[1]) ) );
         if(value[3]){
            proplist = value[3].join('\n');
            $propcel.append(wrapIn('p','Properties accepted:') + wrapIn('pre',wrapIn('code',proplist) ) );
         }
         
         $tab.append($proprow.append($propcel));
      }
      return $tab;
   }
   
   // PUBLIC METHODS
   _obj.load = public_load;
   return _obj;
})();
