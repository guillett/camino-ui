<template>
  <button @click="addPopupOpen">
    <i class="icon-24 icon-file-plus" />
  </button>
</template>

<script>
import DocumentEditPopup from './edit-popup.vue'

export default {
  props: {
    context: { type: Object, required: true },
    document: { type: Object, required: true },
    parentId: { type: String, required: true },
    parentTypeId: { type: String, default: '' },
    repertoire: { type: String, required: true },
    title: { type: String, required: true }
  },

  methods: {
    addPopupOpen() {
      this.$store.commit('popupOpen', {
        component: DocumentEditPopup,
        props: {
          context: this.context,
          creation: true,
          document: this.document,
          parentTypeId: this.parentTypeId,
          repertoire: this.repertoire,
          title: this.title
        }
      })

      this.$emit('titre:eventTrack', {
        categorie: 'titre-sections',
        action: 'titre-etape-doc_ajouter',
        nom: this.$route.params.id
      })
    }
  }
}
</script>
