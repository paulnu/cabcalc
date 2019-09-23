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

  function toggleSubQuestions(id) {
    let el = $(`#${id}`)
    // el.children('input[type=radio]').on('change', (e) => {
    //   console.log(e.target.val())
    // })
    // el.children().hide()
  }

  Promise.all(promises).then(
    $.getJSON("questionarie.json")
      .done((data) => {
        const content = template({
          questions: data
        })
        $('#content').html(content)
        let subs = data.filter((i) => i.subquestions && i.subquestions.length > 0)
        //let subs1 = subs.subquestions.filter((i) => i.subquestions && i.subquestions.length > 0)
        subs.map((s) => {
          // $(`input[name=radio_${s.id}]`).change((e) => {
          //   console.log(e.target.value)
          // })
          // console.log(s.id, s.show_subquestions_trigger, s.subquestions)
          s.subquestions.map((i) => toggleSubQuestions(i.id))
          let subs1 = s.subquestions.filter((i) => i.subquestions && i.subquestions.length > 0)
          subs1.map((s) => {
            // console.log(s.id, s.show_subquestions_trigger)
            s.subquestions.map((i) => toggleSubQuestions(i.id))
            let subs2 = s.subquestions.filter((i) => i.subquestions && i.subquestions.length > 0)
            subs2.map((s) => {
              // console.log(s.id, s.show_subquestions_trigger)
            })
          })
        })
        $('input[type=radio]').on('click', (e) => {
          let t = e.target
          console.log(t.value, t.id)
        })
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