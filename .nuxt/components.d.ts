
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'AdminFilterItem': typeof import("../components/Admin/Filter/AdminFilterItem.vue")['default']
    'AdminTable': typeof import("../components/Admin/Table/AdminTable.vue")['default']
    'CoreActions': typeof import("../components/Core/Actions/Actions.vue")['default']
    'CoreContentCKEditorUltimate': typeof import("../components/Core/Content/CKEditorUltimate.vue")['default']
    'CoreContentHtmlContent': typeof import("../components/Core/Content/HtmlContent.vue")['default']
    'CoreFeedbackToastContainer': typeof import("../components/Core/Feedback/ToastContainer.vue")['default']
    'CoreFilterDateRangeFilter': typeof import("../components/Core/Filter/DateRangeFilter.vue")['default']
    'CoreFilterMultiSelectFilter': typeof import("../components/Core/Filter/MultiSelectFilter.vue")['default']
    'CoreFilterSelectFilter': typeof import("../components/Core/Filter/SelectFilter.vue")['default']
    'CoreFilterTextFilter': typeof import("../components/Core/Filter/TextFilter.vue")['default']
    'CoreFormField': typeof import("../components/Core/Form/FormField.vue")['default']
    'CoreFormWrapper': typeof import("../components/Core/Form/FormWrapper.vue")['default']
    'CoreImageUploader': typeof import("../components/Core/Image/ImageUploader.vue")['default']
    'CoreImageOptimizedImage': typeof import("../components/Core/Image/OptimizedImage.vue")['default']
    'CoreLoadingSpinner': typeof import("../components/Core/Loading/LoadingSpinner.vue")['default']
    'CoreLoadingSkeletonLoader': typeof import("../components/Core/Loading/SkeletonLoader.vue")['default']
    'CoreModalConfirmModal': typeof import("../components/Core/Modal/ConfirmModal.vue")['default']
    'CoreModal': typeof import("../components/Core/Modal/Modal.vue")['default']
    'CoreNavigationPagination': typeof import("../components/Core/Navigation/Pagination.vue")['default']
    'CoreSelectEnumSelect': typeof import("../components/Core/Select/EnumSelect.vue")['default']
    'CoreSelectMultipleSelect': typeof import("../components/Core/Select/MultipleSelect.vue")['default']
    'CoreSelectSearchableMultiSelect': typeof import("../components/Core/Select/SearchableMultiSelect.vue")['default']
    'CoreSelectSearchableSelect': typeof import("../components/Core/Select/SearchableSelect.vue")['default']
    'CoreSelectSingleSelect': typeof import("../components/Core/Select/SingleSelect.vue")['default']
    'CoreTableDataTable': typeof import("../components/Core/Table/DataTable.vue")['default']
    'LayoutFooterSystemFooter': typeof import("../components/Layout/Footer/SystemFooter.vue")['default']
    'LayoutHeaderBar': typeof import("../components/Layout/Header/HeaderBar.vue")['default']
    'LayoutSectionsCustomSection': typeof import("../components/Layout/Sections/CustomSection.vue")['default']
    'LayoutSidebarMenu': typeof import("../components/Layout/Sidebar/SidebarMenu.vue")['default']
    'UserCardsUserCard': typeof import("../components/User/Cards/UserCard.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'ColorScheme': typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyAdminFilterItem': LazyComponent<typeof import("../components/Admin/Filter/AdminFilterItem.vue")['default']>
    'LazyAdminTable': LazyComponent<typeof import("../components/Admin/Table/AdminTable.vue")['default']>
    'LazyCoreActions': LazyComponent<typeof import("../components/Core/Actions/Actions.vue")['default']>
    'LazyCoreContentCKEditorUltimate': LazyComponent<typeof import("../components/Core/Content/CKEditorUltimate.vue")['default']>
    'LazyCoreContentHtmlContent': LazyComponent<typeof import("../components/Core/Content/HtmlContent.vue")['default']>
    'LazyCoreFeedbackToastContainer': LazyComponent<typeof import("../components/Core/Feedback/ToastContainer.vue")['default']>
    'LazyCoreFilterDateRangeFilter': LazyComponent<typeof import("../components/Core/Filter/DateRangeFilter.vue")['default']>
    'LazyCoreFilterMultiSelectFilter': LazyComponent<typeof import("../components/Core/Filter/MultiSelectFilter.vue")['default']>
    'LazyCoreFilterSelectFilter': LazyComponent<typeof import("../components/Core/Filter/SelectFilter.vue")['default']>
    'LazyCoreFilterTextFilter': LazyComponent<typeof import("../components/Core/Filter/TextFilter.vue")['default']>
    'LazyCoreFormField': LazyComponent<typeof import("../components/Core/Form/FormField.vue")['default']>
    'LazyCoreFormWrapper': LazyComponent<typeof import("../components/Core/Form/FormWrapper.vue")['default']>
    'LazyCoreImageUploader': LazyComponent<typeof import("../components/Core/Image/ImageUploader.vue")['default']>
    'LazyCoreImageOptimizedImage': LazyComponent<typeof import("../components/Core/Image/OptimizedImage.vue")['default']>
    'LazyCoreLoadingSpinner': LazyComponent<typeof import("../components/Core/Loading/LoadingSpinner.vue")['default']>
    'LazyCoreLoadingSkeletonLoader': LazyComponent<typeof import("../components/Core/Loading/SkeletonLoader.vue")['default']>
    'LazyCoreModalConfirmModal': LazyComponent<typeof import("../components/Core/Modal/ConfirmModal.vue")['default']>
    'LazyCoreModal': LazyComponent<typeof import("../components/Core/Modal/Modal.vue")['default']>
    'LazyCoreNavigationPagination': LazyComponent<typeof import("../components/Core/Navigation/Pagination.vue")['default']>
    'LazyCoreSelectEnumSelect': LazyComponent<typeof import("../components/Core/Select/EnumSelect.vue")['default']>
    'LazyCoreSelectMultipleSelect': LazyComponent<typeof import("../components/Core/Select/MultipleSelect.vue")['default']>
    'LazyCoreSelectSearchableMultiSelect': LazyComponent<typeof import("../components/Core/Select/SearchableMultiSelect.vue")['default']>
    'LazyCoreSelectSearchableSelect': LazyComponent<typeof import("../components/Core/Select/SearchableSelect.vue")['default']>
    'LazyCoreSelectSingleSelect': LazyComponent<typeof import("../components/Core/Select/SingleSelect.vue")['default']>
    'LazyCoreTableDataTable': LazyComponent<typeof import("../components/Core/Table/DataTable.vue")['default']>
    'LazyLayoutFooterSystemFooter': LazyComponent<typeof import("../components/Layout/Footer/SystemFooter.vue")['default']>
    'LazyLayoutHeaderBar': LazyComponent<typeof import("../components/Layout/Header/HeaderBar.vue")['default']>
    'LazyLayoutSectionsCustomSection': LazyComponent<typeof import("../components/Layout/Sections/CustomSection.vue")['default']>
    'LazyLayoutSidebarMenu': LazyComponent<typeof import("../components/Layout/Sidebar/SidebarMenu.vue")['default']>
    'LazyUserCardsUserCard': LazyComponent<typeof import("../components/User/Cards/UserCard.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyColorScheme': LazyComponent<typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const AdminFilterItem: typeof import("../components/Admin/Filter/AdminFilterItem.vue")['default']
export const AdminTable: typeof import("../components/Admin/Table/AdminTable.vue")['default']
export const CoreActions: typeof import("../components/Core/Actions/Actions.vue")['default']
export const CoreContentCKEditorUltimate: typeof import("../components/Core/Content/CKEditorUltimate.vue")['default']
export const CoreContentHtmlContent: typeof import("../components/Core/Content/HtmlContent.vue")['default']
export const CoreFeedbackToastContainer: typeof import("../components/Core/Feedback/ToastContainer.vue")['default']
export const CoreFilterDateRangeFilter: typeof import("../components/Core/Filter/DateRangeFilter.vue")['default']
export const CoreFilterMultiSelectFilter: typeof import("../components/Core/Filter/MultiSelectFilter.vue")['default']
export const CoreFilterSelectFilter: typeof import("../components/Core/Filter/SelectFilter.vue")['default']
export const CoreFilterTextFilter: typeof import("../components/Core/Filter/TextFilter.vue")['default']
export const CoreFormField: typeof import("../components/Core/Form/FormField.vue")['default']
export const CoreFormWrapper: typeof import("../components/Core/Form/FormWrapper.vue")['default']
export const CoreImageUploader: typeof import("../components/Core/Image/ImageUploader.vue")['default']
export const CoreImageOptimizedImage: typeof import("../components/Core/Image/OptimizedImage.vue")['default']
export const CoreLoadingSpinner: typeof import("../components/Core/Loading/LoadingSpinner.vue")['default']
export const CoreLoadingSkeletonLoader: typeof import("../components/Core/Loading/SkeletonLoader.vue")['default']
export const CoreModalConfirmModal: typeof import("../components/Core/Modal/ConfirmModal.vue")['default']
export const CoreModal: typeof import("../components/Core/Modal/Modal.vue")['default']
export const CoreNavigationPagination: typeof import("../components/Core/Navigation/Pagination.vue")['default']
export const CoreSelectEnumSelect: typeof import("../components/Core/Select/EnumSelect.vue")['default']
export const CoreSelectMultipleSelect: typeof import("../components/Core/Select/MultipleSelect.vue")['default']
export const CoreSelectSearchableMultiSelect: typeof import("../components/Core/Select/SearchableMultiSelect.vue")['default']
export const CoreSelectSearchableSelect: typeof import("../components/Core/Select/SearchableSelect.vue")['default']
export const CoreSelectSingleSelect: typeof import("../components/Core/Select/SingleSelect.vue")['default']
export const CoreTableDataTable: typeof import("../components/Core/Table/DataTable.vue")['default']
export const LayoutFooterSystemFooter: typeof import("../components/Layout/Footer/SystemFooter.vue")['default']
export const LayoutHeaderBar: typeof import("../components/Layout/Header/HeaderBar.vue")['default']
export const LayoutSectionsCustomSection: typeof import("../components/Layout/Sections/CustomSection.vue")['default']
export const LayoutSidebarMenu: typeof import("../components/Layout/Sidebar/SidebarMenu.vue")['default']
export const UserCardsUserCard: typeof import("../components/User/Cards/UserCard.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const ColorScheme: typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyAdminFilterItem: LazyComponent<typeof import("../components/Admin/Filter/AdminFilterItem.vue")['default']>
export const LazyAdminTable: LazyComponent<typeof import("../components/Admin/Table/AdminTable.vue")['default']>
export const LazyCoreActions: LazyComponent<typeof import("../components/Core/Actions/Actions.vue")['default']>
export const LazyCoreContentCKEditorUltimate: LazyComponent<typeof import("../components/Core/Content/CKEditorUltimate.vue")['default']>
export const LazyCoreContentHtmlContent: LazyComponent<typeof import("../components/Core/Content/HtmlContent.vue")['default']>
export const LazyCoreFeedbackToastContainer: LazyComponent<typeof import("../components/Core/Feedback/ToastContainer.vue")['default']>
export const LazyCoreFilterDateRangeFilter: LazyComponent<typeof import("../components/Core/Filter/DateRangeFilter.vue")['default']>
export const LazyCoreFilterMultiSelectFilter: LazyComponent<typeof import("../components/Core/Filter/MultiSelectFilter.vue")['default']>
export const LazyCoreFilterSelectFilter: LazyComponent<typeof import("../components/Core/Filter/SelectFilter.vue")['default']>
export const LazyCoreFilterTextFilter: LazyComponent<typeof import("../components/Core/Filter/TextFilter.vue")['default']>
export const LazyCoreFormField: LazyComponent<typeof import("../components/Core/Form/FormField.vue")['default']>
export const LazyCoreFormWrapper: LazyComponent<typeof import("../components/Core/Form/FormWrapper.vue")['default']>
export const LazyCoreImageUploader: LazyComponent<typeof import("../components/Core/Image/ImageUploader.vue")['default']>
export const LazyCoreImageOptimizedImage: LazyComponent<typeof import("../components/Core/Image/OptimizedImage.vue")['default']>
export const LazyCoreLoadingSpinner: LazyComponent<typeof import("../components/Core/Loading/LoadingSpinner.vue")['default']>
export const LazyCoreLoadingSkeletonLoader: LazyComponent<typeof import("../components/Core/Loading/SkeletonLoader.vue")['default']>
export const LazyCoreModalConfirmModal: LazyComponent<typeof import("../components/Core/Modal/ConfirmModal.vue")['default']>
export const LazyCoreModal: LazyComponent<typeof import("../components/Core/Modal/Modal.vue")['default']>
export const LazyCoreNavigationPagination: LazyComponent<typeof import("../components/Core/Navigation/Pagination.vue")['default']>
export const LazyCoreSelectEnumSelect: LazyComponent<typeof import("../components/Core/Select/EnumSelect.vue")['default']>
export const LazyCoreSelectMultipleSelect: LazyComponent<typeof import("../components/Core/Select/MultipleSelect.vue")['default']>
export const LazyCoreSelectSearchableMultiSelect: LazyComponent<typeof import("../components/Core/Select/SearchableMultiSelect.vue")['default']>
export const LazyCoreSelectSearchableSelect: LazyComponent<typeof import("../components/Core/Select/SearchableSelect.vue")['default']>
export const LazyCoreSelectSingleSelect: LazyComponent<typeof import("../components/Core/Select/SingleSelect.vue")['default']>
export const LazyCoreTableDataTable: LazyComponent<typeof import("../components/Core/Table/DataTable.vue")['default']>
export const LazyLayoutFooterSystemFooter: LazyComponent<typeof import("../components/Layout/Footer/SystemFooter.vue")['default']>
export const LazyLayoutHeaderBar: LazyComponent<typeof import("../components/Layout/Header/HeaderBar.vue")['default']>
export const LazyLayoutSectionsCustomSection: LazyComponent<typeof import("../components/Layout/Sections/CustomSection.vue")['default']>
export const LazyLayoutSidebarMenu: LazyComponent<typeof import("../components/Layout/Sidebar/SidebarMenu.vue")['default']>
export const LazyUserCardsUserCard: LazyComponent<typeof import("../components/User/Cards/UserCard.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyColorScheme: LazyComponent<typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
