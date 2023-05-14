<script setup lang="ts">
	
	const props = defineProps<{
    formSchema: object,
    setFieldValue: void,
  }>()

	const selectedFileName = ref("Select a Picture..")

  function handleUpload(event, schemaField) {
    const file = event.target.files[0]
    selectedFileName.value = file ? file.name : "Select a Picture.."

    props.setFieldValue(schemaField.id, file)
  }

</script>

<template>
	<form class="form-layout is-stacked">
    <div class="form-outer">
      <div class="form-body">
        <div class="form-section is-grey">
          <div class="form-section-header">
            <div class="left"><h3>General</h3></div>
          </div>
          <div class="form-section-inner is-horizontal">
            <VField v-for="schemaField in formSchema" :id="schemaField.id" v-slot="{ field }">
              <VControl class="has-icons-left" icon="feather:user">
                <MultipleFieldSelectComponent
                  v-if="schemaField.type === 'field' && schemaField.relationship === 'many_to_many'"
                  :schemaField="schemaField"
                  :setFieldValue="setFieldValue"
                />
                <OneFieldSelectComponent
                  v-else-if="schemaField.type === 'field' && !schemaField.relationship"
                  :schemaField="schemaField"
                  :setFieldValue="setFieldValue"
                />
                <VSelect v-else-if="schemaField.html_input_type === 'select'">
                  <VOption value="">Select {{ schemaField.label }}</VOption>
                  <VOption v-for="choice in schemaField.choices" :value="choice.value">{{ choice.display_name }}</VOption>
                </VSelect>
                <div class="file has-name" v-else-if="schemaField.html_input_type == 'file'">
                  <label class="file-label">
                    <input class="file-input" type="file" :id="schemaField.id" name="resume" @change="handleUpload($event, schemaField)" />
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                      </span>
                      <span class="file-label"> Choose a file… </span>
                    </span>
                    <span class="file-name light-text"> {{ selectedFileName }} </span>
                  </label>
                </div>
                <VCheckbox
                  v-else-if="schemaField.drf_type === 'boolean'"
                  color="primary"
                  :label="schemaField.label"
                />
                <VInput
                  v-else
                  :type="schemaField.html_input_type"
                  :placeholder="schemaField.label"
                />
                <p v-if="field?.errors?.value?.length" class="help is-danger">
                  {{ field.errors?.value?.join(', ') }}
                </p>
                <p class="help is-primary" v-else-if="schemaField.required">Required Field</p>
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>