///Url padrão da API do Hayô Admin
var apiUrl ='http://hayoapi.herokuapp.com/';

//Funções da aplicação
// Chamada as opções do menu principal
var app = {
  init: function () {
        
    //iniciamos o loader
    helpers.loader.show();

    //Iniciamos o request para a nossa api
    qwest.get(apiUrl)
      .success(function (response) {
        helpers.getTemplate('menu-list-template', {
          categoria: response
        }, 'menu-list');
      })
      .error(function (message) {
        //tratamos o erro
      })
      .complete(function (message) {
        //escondemos o loader
        helpers.loader.hide();
      });
  }
};

//Funções auxiliares
var helpers = {
  getTemplate: function (template, data, destination) {
    var source = document.getElementById(template).innerHTML,
      temp = Handlebars.compile(source);
   

    var content = temp(data),
      dest = document.getElementById(destination);

    dest.innerHTML = content;

    //Adicionamos click nos itens do menu
    var menuLinks = document.querySelectorAll('.menu-item');
    for (var i = 0, l = menuLinks.length; i < l; i++) {
      var item = menuLinks[i];
      item.addEventListener('click', helpers.goTo);
    }

    //Adicionamos click nos itens das telas de listagem
    var menuLinks = document.querySelectorAll('.item-list');
    for (var i = 0, l = menuLinks.length; i < l; i++) {
      var item = menuLinks[i];
      item.addEventListener('click', helpers.goDetalhe);
    }
  
    //Adicionamos click nos botões voltar das telas de listagem
    var back = document.querySelectorAll('.go-back');
    for (var i = 0, l = back.length; i < l; i++) {
      var item = back[i];
      item.addEventListener('click', helpers.goBack);
    }

    //Adicionamos click nos itens da listagem de transporte e efetuada a chamada do DISCADOR.
    var menuLinks = document.querySelectorAll('.item-lista');
    for (var i = 0, l = menuLinks.length; i < l; i++) {
        var item = menuLinks[i];
       item.addEventListener('click', helpers.goCall);
    }  

    //Adicionamos click nos botões voltar das telas de detalhes
    var back = document.querySelectorAll('.go-back_D');
    for (var i = 0, l = back.length; i < l; i++) {
      var item = back[i];
      item.addEventListener('click', helpers.goBack_D);
    }

    //Adicionamos click nos botões voltar da tela Sobre Cabrália
    var back = document.querySelectorAll('.go-back_S');
    for (var i = 0, l = back.length; i < l; i++) {
      var item = back[i];
      item.addEventListener('click', helpers.goBack_S);
    }

  },

  // chama a tela de listagem da OPÇÃO selecionado
  goTo: function (e) {
    var categoria = this.getAttribute('data-categoria'),
    title = this.getAttribute('data-title');

    //Inserimos o novo titulo na pagina de listas  
    helpers.setTitle(title);  
    
    if (categoria == 'sobre') {
      // chama a tela de detalhe SOBRE CABRALIA

      var API = 'sobre/'

      // Mostramos o loader
      helpers.loader.show();
 
      qwest.get(apiUrl + API)
      .success(function (response) {
        helpers.getTemplate('sobre-cabralia-template', {
          detalhe: response
        }, 'detalhe-lista');    

      // chama a tela Sobre Cabrália
      document.getElementById('sobre-cabralia-page').className = 'current';
      document.querySelector('[data-position="current"]').className = 'left'; 

      })
      .error(function (message) {
        //tratamos o erro
      })
      .complete(function (message) {
        //escondemos o loader
        helpers.loader.hide();
      });

    } else if (categoria == 'transp/') {
      // chama a tela de listagem de TRANSPORTES sem a necessidade de TELA DE DETALHES
     
      //Mostramos o loader
      helpers.loader.show();

      qwest.get(apiUrl + categoria)
      .success(function (response) {
        helpers.getTemplate('item-list-transp-template', { 
          itens: response
      }, 'item-list');

      // chama a tela de listagem, fazendo a transição 
      document.getElementById('list-item-page').className = 'current';
      document.querySelector('[data-position="current"]').className = 'left';    
        
      })
      .error(function (message) {
        //tratamos o erro
      })
      .complete(function (message) {
        //escondemos o loader
        helpers.loader.hide();
      });

    } else if (categoria == 'even/') {
      // chama a tela de listagem de EVENTOS
      //Mostramos o loader
      helpers.loader.show();

      // pega a data atual para listar apenas os eventos que ocorreram a partir de hoje. Só lista eventos futuros
      var data_hoje = new Date();

    
      qwest.get(apiUrl + categoria + data_hoje)
      .success(function (response) {
        helpers.getTemplate('item-list-eventos-template', { 
          itens: response
        }, 'item-list');

      // chama a tela de listagem, fazendo a transição 
      document.getElementById('list-item-page').className = 'current';
      document.querySelector('[data-position="current"]').className = 'left';    
        
      })
      .error(function (message) {
        //tratamos o erro
      })
      .complete(function (message) {
        //escondemos o loader
        helpers.loader.hide();
      });

    } else {

      // chama as demais telas de listagem
      //Mostramos o loader
      helpers.loader.show();
 
      qwest.get(apiUrl + categoria)
      .success(function (response) {
        helpers.getTemplate('item-list-template', {
          itens: response
        }, 'item-list');

      // chama a tela de listagem, fazendo a transição 
      document.getElementById('list-item-page').className = 'current';
      document.querySelector('[data-position="current"]').className = 'left';    
        
      })
      .error(function (message) {
        //tratamos o erro
      })
      .complete(function (message) {
        //escondemos o loader
        helpers.loader.hide();
    });
  }
 
  },
  
  goDetalhe: function (e) {
    var categoria = this.getAttribute('data-categoria'),
    title = this.getAttribute('data-title');

    var colection = this.getAttribute('data-colection');
    var id = this.getAttribute('data-id');
    
    //Inserimos o novo titulo na pagina de listas
    helpers.setTitle(title);

    //Mostramos o loader
    helpers.loader.show();

    if (colection == 'even/') {
      colection = 'event/';
    };

    //Fazendo o get da url de itens passando a categoria
    qwest.get(apiUrl + colection + id)
      .success(function (response) {  

         // converte o objeto JSON e strint
         var lixo = JSON.stringify(response);
         // acrescenta '[' ']' na string para leitura corrreta no helpers
         lixo='['+lixo+']';
         // converte a string modificada em objegto JSON novamente 
         response = JSON.parse(lixo);  


         if (colection == 'event/') {

            // chama template detalhe de EVENTOS
            helpers.getTemplate('detalhe-eventos-template', {
            detalhe:  response 
            }, 'detalhe-list');    

            // pega o click da imagem telefone e chama do discador
            document.querySelector('#img-telefone-new').addEventListener('click', helpers.goCall);
            // pega o click da imagem Fanpage e chama o browser
            document.querySelector('#img-facebook').addEventListener('click', helpers.goURL);
            // pega o click da imagem Website e chama o browser
            document.querySelector('#img-site').addEventListener('click', helpers.goURLweb);
            // pega o click da imagem Mapa e chama o browser com a localização no Google Maps
            document.querySelector('#img-endereco-new').addEventListener('click', helpers.goURLmap);

      
        
         } else if (colection == 'pontos/') {
            // chama template detalhe de EVENTOS
           
            helpers.getTemplate('detalhe-tela-template', {
            detalhe:  response 
            }, 'detalhe-list');             

            // pega o click da imagem Mapa e chama o browser com a localização no Google Maps
            document.querySelector('#img-endereco').addEventListener('click', helpers.goURLmap);

         } else if (colection == 'transp/') {
            // chama template detalhe de EVENTOS
            helpers.getTemplate('detalhe-tela-template', {
            detalhe:  response 
            }, 'detalhe-list');   

            // pega o click da imagem telefone e chama do discador
            document.querySelector('#telef').addEventListener('click', helpers.goCall);

         } else {       

          // chama template detalhe das demais opções
          helpers.getTemplate('detalhe-tela-template', {
          detalhe:  response 
          }, 'detalhe-list');  

          //pega o click da imagem telefone e chama do discador
          document.querySelector('#telef').addEventListener('click', helpers.goCall);
          // pega o click da imagem Mapa e chama o browser com a localização no Google Maps
          document.querySelector('#img-endereco').addEventListener('click', helpers.goURLmap);
        }

      // chama a tela de listagem, fazendo a transição 
      document.getElementById('detalhe-item-page').className = 'current';
      document.querySelector('[data-position="current"]').className = 'left'; 

      })
      .error(function (message) {
        //tratamos o erro
      })
      .complete(function (message) {
         //escondemos o loader
         helpers.loader.hide();
                 

      });   
  },

  // chama a tela de Detalhe do ITEM selecionado
  goBack: function () {
    document.getElementById('list-item-page').className = 'right';
    document.querySelector('[data-position="current"]').className = 'current';
  },

  // chama a tela de Detalhe do ITEM selecionado
  goBack_D: function () {
    document.getElementById('detalhe-item-page').className = 'right';
    document.querySelector('[data-position="current"]').className = 'current';
  },

  goBack_S: function () {
    document.getElementById('sobre-cabralia-page').className = 'right';
    document.querySelector('[data-position="current"]').className = 'current';
  },

  // faz a chamada do discador com o número recebido da tela de detalhe
  goCall: function () {
  
    var numero = this.getAttribute('data-tel');
 
   

    var call = new MozActivity({
    name: "dial",
    data: {
        number: numero
    }
    });

  },

  // faz a chamada do Browse com a URL recebida da Fan-Page
  goURL: function (tipo) {
    
    var url_open = this.getAttribute('data-face');  
       
    var openURL = new MozActivity({
    name: "view",
    data: {
        type: "url", // Possibly text/html in future versions
        url: url_open }
    });

  },

  // faz a chamada do Browse com a URL recebida do WebSite
  goURLweb: function (tipo) {
    
    var url_open = this.getAttribute('data-web');  
    
    var openURL = new MozActivity({
    name: "view",
    data: {
        type: "url", // Possibly text/html in future versions
        url: url_open }
    });

  },

  // faz a chamada do Browse com as coordenadas de localização
  goURLmap: function (tipo) {
    
    var latitude = this.getAttribute('data-latitude');  
    var longitude = this.getAttribute('data-longitude');  
    url_open = "http://maps.google.com/maps?q="+latitude+','+longitude+"&z=15";
    
    var openURL = new MozActivity({
    name: "view",
    data: {
        type: "url", // Possibly text/html in future versions
        url: url_open }
    });

  },

  setTitle: function (title) {
    var listTitle = document.getElementById('item-list-title');
    listTitle.textContent = title;
  },
  loader: {
    show: function () {
      var loader = document.getElementById('loader');
      loader.classList.remove('hide');
    },
    hide: function () {
      var loader = document.getElementById('loader');
      loader.classList.add('hide');
    }
  }
};

app.init();