// import { questionItem } from "./model.js"

$(() => {
  const hbs = Handlebars
  const src = $('#entry-template').html()
  const template = hbs.compile(src)
  const partials = ['main', 'iradio', 'inumber', 'itext']
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

        // $('input[type=radio]').on('click', (e) => {
        //   let t = e.target
        //   console.log(t.value, t.id)
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