// import { questionItem } from "./model.js"

$(() => {
  const hbs = Handlebars
  const src = $('#entry-template').html()
  const template = hbs.compile(src)
  const partials = ['main', 'question.item', 'icheck', 'inumber', 'itext', 'iradio']
  const promises = []

  hbs.registerHelper('isNumberType', (data, options) => {
    return data.input_type === 'number' ? options.fn(data) : options.inverse(data)
  })

  hbs.registerHelper('isTextType', (data, options) => {
    return data.input_type === 'text' ? options.fn(data) : options.inverse(data)
  })

  hbs.registerHelper('isRadioType', (data, options) => {
    return data.input_type === 'radio' ? options.fn(data) : options.inverse(data)
  })

  hbs.registerHelper('isCheckType', (data, options) => {
    return data.input_type === 'check' ? options.fn(data) : options.inverse(data)
  })

  hbs.registerHelper('areSubquestions', (data, options) => {
    return data.subquestions && data.subquestions.length > 0 ? options.fn(data) : options.inverse(data)
  })

  partials.map((p) => {
    promises.push($.get(`partials/${p}.hbs`, (data) => {
      hbs.registerPartial(p, data)
    }, 'html'))
  })

  Promise.all(promises).then(
    $.getJSON("questionarie.json")
      .done((data) => {
        const content = template({
          questions: data
        })
        $('#content').html(content)
        $('.l2,l3').hide()
        $('.l1').css('border', '1px solid blue')
        $('.l2').css('border', '1px solid red')
        $('.l3').css('border', '1px solid green')


        $('div.level').on('click', (e) => {
          e.stopPropagation()
          console.log('clicked')
          let $this = $(e.currentTarget)
          let toggleVal = $this.find('input[type=radio]:checked').val()
          let toggleLevel = $this.children('.level').first()
          toggleVal === 'Yes' ? toggleLevel.show() : toggleLevel.hide()
          // let id = $this.attr('id')
          // console.log($this.children().length)
        })

        // $('input[type=radio]').on('click', (e) => {
        //   // let t = e.target
        //   let $this = $(e.currentTarget)
        //   console.log($this.attr('data-q4'))
        //   // console.log(t.value, t.id)
        // })
        // $('#calc').on('click', (e) => {
        //   let t = e.target
        //   console.log(t.id)
        // })
      })
      .fail((jqxhr, textStatus, error) => {
        var err = textStatus + ", " + error
        console.log("Request Failed: " + err)
      })
  )
})