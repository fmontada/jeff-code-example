locals {
  flattened_prompts = flatten([
    for language, prompts in var.prompt_custom_texts : [
      for prompt, body_file in prompts : {
        "language"  = language,
        "prompt"    = prompt,
        "body_file" = body_file.file
      }
    ]
  ])
}

resource "auth0_prompt_custom_text" "prompt_custom_text_group" {
  for_each = {
    for language_prompt in local.flattened_prompts :
    "${language_prompt.language}_${language_prompt.prompt}" => language_prompt
  }

  prompt   = each.value.prompt
  language = each.value.language
  body     = file(each.value.body_file)
}
