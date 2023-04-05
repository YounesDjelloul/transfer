<script setup lang="ts">
  import { useNotyf } from '/@src/composable/useNotyf'
  import sleep from '/@src/utils/sleep'

  const notyf = useNotyf()
  const { y } = useWindowScroll()

  const isLoading = ref(false)

  const isScrolling = computed(() => {
    return y.value > 30
  })
  const onSave = async () => {
    isLoading.value = true
    await sleep()
    notyf.success('Your changes have been successfully saved!')
    isLoading.value = false
  }
</script>

<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>Settings</h3>
          <p>Edit your account prefs and settings</p>
        </div>
        <div class="right">
          <div class="buttons">
            <VButton
              to="/sidebar/layouts/profile-view"
              icon="lnir lnir-arrow-left rem-100"
              light
              dark-outlined
            >
              Go Back
            </VButton>
            <VButton
              color="primary"
              raised
              :loading="isLoading"
              tabindex="0"
              @keydown.space.prevent="onSave"
              @click="onSave"
            >
              Save Changes
            </VButton>
          </div>
        </div>
      </div>
    </div>
    <form class="form-body" @submit.prevent="onSave">
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Change Password</h4>
          <p>For an improved account security</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:unlock">
                <VInput
                  type="password"
                  placeholder="Old Password"
                  autocomplete="current-password"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <VInput
                  type="password"
                  placeholder="New Password"
                  autocomplete="new-password"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <VInput
                  type="password"
                  placeholder="Repeat New Password"
                  autocomplete="new-password"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>