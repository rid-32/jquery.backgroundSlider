;( function( $, w ) {
	
  var methods = ( function() {
    
    //объект с настройками слайдера 
    var args;
    //количесво кадров слайдера
    var frames;
    //номер текущего кадра слайдера
    var frame;
    //ссылка на главный объект
    var self;
    //коллекция стикеров для отображения
    var $li = undefined;
    //время переключения слайдов
    var duration;
    //идентификатор слайдера
    var timerId = undefined;
    //абсолютный блок для эффекта glassFilter
    var $glassFilter = undefined;
    //jQuery-объект с данными, полученными через AJAX
    var ajaxObject = undefined;
    
    //функция загружает изображения из массива в кэш браузера
    //по завершению загрузки всех изображений выполняется функция, переданная вторым аргументом
    function loadImages( func ) {
      
      //Создаем невидимый блок, в который будут загружаться изображения
      //и добавляем его в DOM страницы
      var $div = $( document.createElement( 'div' ) );
      
      $div.css( {
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
        'visibility': 'hidden'
      } );
      
      $( 'body' ).append( $div );
      
      //Функция рекурсивной загрузки изображений и добавления их в DOM страницы
      //Каждое следующее изображение загружается после загрузки предыдущего
      ( function recursiveLoad( imageArr, func ) {
      
        var $img = $( document.createElement( 'img' ) );
        
        $img.on( 'load', function() {
          if ( imageArr.length == 1 ) {
            
            //Удаляем блок с загруженными в него изображениями
            $div.remove();
            
            //Запускаем слайдер
            func();
          } else {
            recursiveLoad( imageArr.slice( 1 ), func );
          }
        } );
        
        //если изображение в массиве есть, то загружать его
        //если нет, то брать следующее изображение
        if ( imageArr[ 0 ] ) {
          $img.attr( 'src', imageArr[ 0 ] );
          
          $div.append( $img );
        } else if ( imageArr.length > 1 ) {
          recursiveLoad( imageArr.slice( 1 ), func );
        } else {
          $div.remove();
          func();
        }
        
      } )( args.images, func );
    }
    
    //показ следующего слайда
    function nextSlide() {
      frame == frames - 1 ? frame = 0 : ++ frame;
      methods.setFrame.call( self );
    }
    
    //показ предыдущего слайда
    function prevSlide() {
      frame == 0 ? frame = frames - 1 : --frame;
      methods.setFrame.call( self );
    }
    
    //функция, вешающая обработчики кликов мышью на указатели слайдера
    function clickPtr( l_ptr, r_ptr ) {
      //если в настройках указан левый указатель
      if ( l_ptr ) {
        $( l_ptr ).bind( 'click.headerSlider', function() {
        
        prevSlide();
        
        //останавливаем таймер автоматической прокрутки слайдов
        //и запускаем его заново
        if ( timerId ) {
          clearTimeout( timerId );
          autoRun();
        }
        
        return false;          
        } );
      }
      
      //если указан правый указатель
      if ( r_ptr ) {
        $( r_ptr ).bind( 'click.headerSlider', function() {
        
        nextSlide();
        
        //останавливаем таймер автоматической прокрутки слайдов
        //и запускаем его заново
        if ( timerId ) {
          clearTimeout( timerId );
          autoRun();
        }
        
        return false;  
        } );
      }
    }
    
    //функция вешает обработчики на стикеры
    function clickStickers() {
      
      $li.bind( 'click.headerSlider', function() {
        frame = $li.index( this );
        
        methods.setFrame.call( self );
        
        //останавливаем таймер автоматической прокрутки слайдов
        //и запускаем его заново
        if ( timerId ) {
          clearTimeout( timerId );
          autoRun();
        }
        
        return false;
      } );
    }
    
    //функция автоматического запуска слайдера
    function autoRun() {
      timerId = setTimeout( function tick() {
				
				nextSlide();
				
				timerId = setTimeout( tick, duration );
			}, duration );
    }
    
    //функция запуска слайдера
    function run() {
        
      //проверяем, используется ли стикер для отображения
      if ( args.sticker && args.activeClass ) {
        $li = $( args.sticker ).find( 'li' );
        
        //проверяем, используется ли стикер для навигации
        if ( args.stickerClick ) {
          clickStickers();
        }
      }
      
      //устанавливаем кадр
      methods.setFrame.call( self );
      
      //проверяем, используются ли кнопки переключения
      if ( args.leftPtr || args.rightPtr ) {
        //вешаем обработчики 
        clickPtr( args.leftPtr, args.rightPtr );
      }
      
      //проверяем, нужен ли автозапуск
      if ( args.autoRun ) {
        duration = args.duration || self.headerSlider.defaults.duration;
        
        autoRun();
      }
    }
    
    return {
      
      //Метод инициализации и последующего запуска слайдера слайдера
      init: function( arg ) {
        
        //сохранение ссылки на объект с настройками слайдера
        args = arg;
        
        //сохранение главного объекта
        self = this;
        
        //получаем номер начального кадра
        frame = args.frame === undefined ? this.headerSlider.defaults.frame : args.frame;
        if ( frame >= frames ) {
          frame = this.headerSlider.defaults.frame;
        }
        
        //если используется glassFilter
        if ( args.glassFilter ) {
          
          //настраиваем header
          this.css( {
            'position': 'relative',
            'z-index': '1'
          } );
          
          //создаём абсолютный блок и добавляем его в header
          $glassFilter = $( document.createElement( 'div' ) );
          $glassFilter.css( {
            'position': 'absolute',
            'left': '0px',
            'top': '0px',
            'width': '100%',
            'height': '100%',
            'z-index': '-1'
          } );
          this.prepend( $glassFilter );
        }
        
        //если нужно менять другой контент при слайд-шоу
        if ( args.slideOther ) {
          $.ajax( {
            url: args.slideOther.insertFrom,
            context: this,
            dataType: 'html',
            success: function( data ) {
              ajaxObject = data;
            },
            converters: {
              "text html": function( data ) {
                return $( data );
              }
            }
          } );
        }
        
        //если передан массив с изображениями
        if ( args.images ) {
          
          //определяем количество кадров
          frames = args.frames || args.images.length;
          
          //загружаем изображения и, после этого, запускаем слайдер
          loadImages( function() {
            run();
          } );
        } else {
          if ( args.frames ) {
            frames = args.frames;
            run();
          } else {
            $.error( 'Number of frames is not set in object with slider settings (for example, frames: 3).' );
          }
        }
      },
      
      //метод устанавливает указанный в frame слайд
      //при вызове необходимо привязать контекст - главный объект
      //в параметрах можно передать номер слайда для отображения и 
      //объект с настройками слайдера
      setFrame: function( f, arg ) {
        
        //Переменная для сохранения объекта с настройками слайдера
        var ar;
        
        //если используется стикер для отображения номера слайда
        if ( $li ) {
          //убираем выделенный стикер
          $li.removeClass( args.activeClass );
          //добавляем выделенный стикер
          $li.eq( frame ).addClass( args.activeClass );
        }
        
        //определяем, был ли передан номер слайда в параметрах
        var fr = f === undefined ? frame : f;
        
        //определяем, были ли переданы настройки в параметрах или сохранены глобально
        if ( arg ) {
          ar = arg;
        } else {
          ar = args;
        }
        
        //если передан массив с изображениями, устанавливаем фон
        //в дальнейшем нужно написать функцию установки фона,
        //где будет использоваться анимация
        if ( ar.images && ar.images[ fr ] ) {
          this.css( 'background-image', 'url(' + ar.images[ fr ] + ')' );
        } else {
          this.css( 'background-image', 'none' );
        }
        
        //если передан цвет фона
        if ( ar.bgColors && ar.bgColors[ fr ] ) {
          this.css( 'background-color', ar.bgColors[ fr ] );
        } else {
          this.css( 'background-color', '#fff' );
        }
        
        //если передан размер фона
        if ( ar.bgSize && ar.bgSize[ fr ] ) {
          this.css( 'background-size', ar.bgSize[ fr ] );
        } else {
          this.css( 'background-size', 'auto auto' );
        }
        
        //если передано повторение фона
        if ( ar.bgRepeat && ar.bgRepeat[ fr ] ) {
          this.css( 'background-repeat', ar.bgRepeat[ fr ] );
        } else {
          this.css( 'background-repeat', 'repeat' );
        }
        
        //если передана позиция фона
        if ( ar.bgPosition && ar.bgPosition[ fr ] ) {
          this.css( 'background-position', ar.bgPosition[ fr ] );
        } else {
          this.css( 'background-position', '0% 0%' );
        }
        
        //если используется glassFilter
        if ( ar.glassFilter && ar.glassFilter[ fr ] ) {
          $glassFilter.css( 'background-color', ar.glassFilter[ fr ] );
        } else {
          //цвет фона прозрачный
          $glassFilter.css( 'background-color', 'transparent' );
        }
        
        //если определён ajaxObject
        if ( ajaxObject ) {
          this.find( ar.slideOther.changeParent ).html( ajaxObject.filter( ar.slideOther.changeTarget ).eq( fr ) );
        }
      }
    } 
  } )();
  
  //Основной метод плагина
  $.fn.headerSlider = function( method ) {
    
    //Вызываем указанный метод или метод инициализации слайдера
    //В противном случае генерируем ошибку
    if ( methods[ method ] ) {
			methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
		else if ( typeof method === 'object' ) {
			methods.init.apply( this, arguments );
		}
		else if ( ! method ) {
      $.error( 'Isn`t passed object with slider settings' );
    } else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.fn.headerSlider' );
		}
    
  };
  
  //Параметры плагина по умолчанию
  $.fn.headerSlider.defaults = {
    images: [],     //по умолчанию - background-image: none;
    bgColors: [],   //по умолчанию цветом фона для всех изображений явл-ся белый - #fff
    bgSize: [],     //по умолчанию - background-size: auto, auto;
    bgRepeat: [],   //по умолчанию - background-repeat: repeat;
    bgPosition: [], //по умолчанию - background-position: 0% 0%
    glassFilter: [],//по умолчанию - transparent. Чтобы включить, необходимо передать строку с цветом
    frame: 0,
    frames: 3,      //количество слайдов. Необязателен. Определяется по размеру массива с изображениями
    leftPtr: '#leftPtrId',
    rightPtr: '#rightPtrId',
    autoRun: false,
    duration: 5000,
    sticker: '#stickerId',
    activeClass: 'active-sticker',
    stickerClick: false,
    slideOther: {
      changeParent: '#content',           //куда вставлять
      changeTarget: '.slider-title',      //что вставлять
      insertFrom: 'sliderContent.html'    //откуда вставлять
    }
  };
  
} )( jQuery, window );



