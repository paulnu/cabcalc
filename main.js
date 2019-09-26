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

  Handlebars.registerHelper('subids', (data) => {
    return data.map(e => '#' + e.id).join(',')
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
        $('input[data-subids]').each((i, e) => {
          let ids = $(e).attr('data-subids')
          $(ids).hide()
        })

        $('.l1').css('border', '1px solid blue')
        $('.l2').css('border', '1px solid red')
        $('.l3').css('border', '1px solid green')

        $('input[data-subids]').on('click', (e) => {
          let $this = $(e.currentTarget)
          let ids = $this.attr('data-subids')
          $this.val() === 'Yes' ? $(ids).show() : $(ids).hide()
        })

        $('#calc').on('click', (e) => {
          let $this = $(e.currentTarget)
          console.log($this.attr('id'))
        })
      })
      .fail((jqxhr, textStatus, error) => {
        var err = textStatus + ", " + error
        console.log("Request Failed: " + err)
      })
  )
})