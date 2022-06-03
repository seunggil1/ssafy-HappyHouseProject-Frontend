<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <div class="row">
            <div class="col mb-lg-0 mb-4">
              <div class="card">
                <div class="card-body p-3">
                  <div class="row">
                    <div class="col">
                      <div class="d-flex flex-column h-100">
                        <h6 class="font-weight-bolder me-auto">
                          <a :href="link" target="_blank">{{ title }}</a>
                        </h6>
                        <p class="me-auto">
                          {{ description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "HappyhouseVueNewsComponent",
  props: ["link", "description", "title"],
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>