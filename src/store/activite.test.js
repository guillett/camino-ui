import activite from './activite'
import * as api from '../api/activites'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

jest.mock('../api/activites', () => ({
  activiteModifier: jest.fn(),
  activite: jest.fn()
}))
console.log = jest.fn()

describe("état d'une activité", () => {
  let store
  let mutations
  let actions

  beforeEach(() => {
    activite.state = { current: null }

    actions = {
      reload: jest.fn(),
      messageAdd: jest.fn(),
      pageError: jest.fn(),
      apiError: jest.fn()
    }

    mutations = {
      popupMessagesRemove: jest.fn(),
      loadingAdd: jest.fn(),
      loadingRemove: jest.fn(),
      popupClose: jest.fn(),
      popupMessageAdd: jest.fn(),
      popupLoad: jest.fn()
    }

    store = new Vuex.Store({
      modules: { activite },
      mutations,
      actions,
      state: { titre: { current: { id: 5 } } }
    })
  })

  test('valide une activité', async () => {
    api.activiteModifier.mockResolvedValue({ statut: { id: 'dep' } })

    await store.dispatch('activite/update', {
      activite: {
        id: 27,
        contenu: [],
        statut: { id: 'dep' }
      },
      context: null
    })

    expect(mutations.popupClose).toHaveBeenCalled()
    expect(mutations.loadingRemove).toHaveBeenCalled()
    expect(actions.messageAdd).toHaveBeenCalledTimes(1)
  })

  test('valide une activité sur une activité', async () => {
    api.activiteModifier.mockResolvedValue({ statut: { id: 'dep' } })
    activite.state.current = { id: 'activite-id' }

    await store.dispatch('activite/update', {
      activite: {
        id: 27,
        contenu: [],
        statut: { id: 'dep' }
      },
      context: 'activite'
    })

    expect(mutations.popupClose).toHaveBeenCalled()
    expect(mutations.loadingRemove).toHaveBeenCalled()
    expect(actions.messageAdd).toHaveBeenCalledTimes(1)
    expect(actions.reload).toHaveBeenCalledTimes(1)
  })

  test('enregistre une activité pour un titre', async () => {
    api.activiteModifier.mockResolvedValue({ statut: { id: 'enc' } })

    await store.dispatch('activite/update', {
      activite: {
        id: 27,
        contenu: [],
        statut: { id: 'enc' }
      },
      context: 'titre'
    })

    expect(mutations.popupClose).toHaveBeenCalled()
    expect(mutations.loadingRemove).toHaveBeenCalled()
    expect(actions.messageAdd).toHaveBeenCalledTimes(2)
    expect(actions.reload).toHaveBeenCalled()
  })

  test("erreur dans l'api lors de l'enregistrement d'une activité", async () => {
    const apiMock = api.activiteModifier.mockRejectedValue(
      new Error("l'api ne répond pas")
    )
    await store.dispatch('activite/update', {
      activite: {
        id: 27,
        contenu: [],
        statut: { id: 'dep' }
      },
      context: 'titre'
    })

    expect(apiMock).toHaveBeenCalled()
    expect(apiMock).toHaveBeenCalledWith({
      activite: { id: 27, contenu: [], statutId: 'dep' }
    })
    expect(mutations.popupMessageAdd).toHaveBeenCalled()
  })

  test('affiche une activité', async () => {
    api.activite.mockResolvedValue({
      id: 27,
      contenu: [],
      statut: { id: 'dep' }
    })

    await store.dispatch('activite/get')

    expect(store.state.activite.current).toEqual({
      id: 27,
      contenu: [],
      statut: { id: 'dep' }
    })

    expect(mutations.loadingRemove).toHaveBeenCalled()
  })

  test("n'obtient pas d'activité si l'api ne retourne rien pour cette id", async () => {
    const apiMock = api.activite.mockResolvedValue(null)
    await store.dispatch('activite/get', 'activite-id')

    expect(apiMock).toHaveBeenCalledWith({ id: 'activite-id' })
    expect(actions.pageError).toHaveBeenCalled()
    expect(store.state.activite.current).toBeNull()
  })

  test("retourne une erreur de l'api dans l'obtention de l'activité", async () => {
    const apiMock = api.activite.mockRejectedValue(
      new Error("l'api ne répond pas")
    )
    await store.dispatch('activite/get', 'activite-id')

    expect(apiMock).toHaveBeenCalledWith({ id: 'activite-id' })
    expect(actions.apiError).toHaveBeenCalled()
  })

  test("supprime les données d'activité", () => {
    store.commit('activite/set', { id: 71, nom: 'toto' })
    store.commit('activite/reset')

    expect(store.state.activite.current).toBeNull()
  })
})
