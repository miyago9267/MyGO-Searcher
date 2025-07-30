import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { ImagesApi, searchImages } from '~/apis/images'
import type { ImageItem, SearchParams, FilterOptions, UseImagesOptions } from '~/types'

/**
 * Composable for managing image search and filtering
 */
export function useImages(options: UseImagesOptions = {}) {
	const {
		initialQuery = '',
		pageSize = 20,
		fuzzySearch = false
	} = options

	// State
	const images = ref<ImageItem[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)
	const hasMore = ref(false)
	const currentPage = ref(1)
	const totalCount = ref(0)

	// Search state
	const searchQuery = ref(initialQuery)
	const isFuzzyEnabled = ref(fuzzySearch)

	// Infinite scroll state
	const loadMoreTrigger = ref<HTMLElement>()
	let observer: IntersectionObserver | null = null

	/**
	 * Fetch images based on query
	 */
	const fetchImages = async (query = '', page = 1, append = false) => {
		if (loading.value) return

		loading.value = true
		error.value = null

		try {
			const params: SearchParams = {
				q: query,
				fuzzy: isFuzzyEnabled.value,
				page,
				limit: pageSize
			}

			const response = query.trim()
				? await ImagesApi.search(params)
				: await ImagesApi.getAll({ page, limit: pageSize })

			if (append) {
				images.value = [...images.value, ...response.data]
			} else {
				images.value = response.data
			}

			if (response.meta && 'total' in response.meta) {
				totalCount.value = response.meta.total
				hasMore.value = response.meta.hasNext
				currentPage.value = page
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Failed to fetch images'
			console.error('Error fetching images:', err)
		} finally {
			loading.value = false
		}
	}

	/**
	 * Search images with new query
	 */
	const search = async (query: string) => {
		searchQuery.value = query
		currentPage.value = 1
		await fetchImages(query, 1, false)
	}

	/**
	 * Load more images (pagination)
	 */
	const loadMore = async () => {
		if (hasMore.value && !loading.value) {
			await fetchImages(searchQuery.value, currentPage.value + 1, true)
		}
	}

	/**
	 * Toggle fuzzy search
	 */
	const toggleFuzzy = async () => {
		isFuzzyEnabled.value = !isFuzzyEnabled.value
		await fetchImages(searchQuery.value, 1, false)
	}

	/**
	 * Get random images
	 */
	const getRandomImages = async (count = 1) => {
		loading.value = true
		error.value = null

		try {
			const response = await ImagesApi.getRandom({ count })
			images.value = response.data
			totalCount.value = response.data.length
			hasMore.value = false
			currentPage.value = 1
			searchQuery.value = ''
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Failed to fetch random images'
			console.error('Error fetching random images:', err)
		} finally {
			loading.value = false
		}
	}

	/**
	 * Reset to initial state
	 */
	const reset = () => {
		images.value = []
		searchQuery.value = ''
		currentPage.value = 1
		totalCount.value = 0
		hasMore.value = false
		error.value = null

		// 清理觀察器
		if (observer) {
			observer.disconnect()
			observer = null
		}
	}

	/**
	 * Setup infinite scroll observer
	 */
	const setupInfiniteScroll = () => {
		if (!loadMoreTrigger.value) return

		// 先清理舊的觀察器
		if (observer) {
			observer.disconnect()
			observer = null
		}

		observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]
				if (entry.isIntersecting && hasMore.value && !loading.value) {
					console.log('觸發自動載入更多')
					loadMore()
				}
			},
			{
				rootMargin: '50px', // 提前 50px 觸發載入
				threshold: 0.1
			}
		)

		observer.observe(loadMoreTrigger.value)
		console.log('無限滾動觀察器已設置')
	}

	/**
	 * Initialize infinite scroll when trigger element is ready
	 */
	const initInfiniteScroll = async (triggerElement: HTMLElement) => {
		loadMoreTrigger.value = triggerElement
		await nextTick()
		setupInfiniteScroll()
	}

	/**
	 * Cleanup observer
	 */
	const cleanupInfiniteScroll = () => {
		if (observer) {
			observer.disconnect()
			observer = null
		}
	}

	// Auto-search when query changes
	watch(searchQuery, (newQuery) => {
		fetchImages(newQuery, 1, false)
	})

	return {
		// State
		images,
		loading: readonly(loading),
		error: readonly(error),
		hasMore: readonly(hasMore),
		currentPage: readonly(currentPage),
		totalCount: readonly(totalCount),
		searchQuery,
		isFuzzyEnabled: readonly(isFuzzyEnabled),

		// Actions
		search,
		fetchImages,
		loadMore,
		toggleFuzzy,
		getRandomImages,
		reset,

		// Infinite scroll
		initInfiniteScroll,
		cleanupInfiniteScroll
	}
}

/**
 * Composable for filtering images
 */
export function useImageFilter(images: Ref<ImageItem[]>, filters: Ref<FilterOptions>) {
	const filteredImages = computed(() => {
		if (!filters.value.MyGO集數?.length &&
			!filters.value.AveMujica集數?.length &&
			!filters.value.MyGO人物?.length) {
			return images.value
		}

		return images.value.filter((image) => {
			const matchesMyGOEpisode = !filters.value.MyGO集數?.length ||
				filters.value.MyGO集數.includes(image.episode || '')

			const matchesAveMujicaEpisode = !filters.value.AveMujica集數?.length ||
				filters.value.AveMujica集數.includes(image.episode || '')

			const matchesMyGOCharacter = !filters.value.MyGO人物?.length ||
				filters.value.MyGO人物.includes(image.author || '')

			return matchesMyGOEpisode && matchesAveMujicaEpisode && matchesMyGOCharacter
		})
	})

	const filteredCount = computed(() => filteredImages.value.length)

	return {
		filteredImages,
		filteredCount
	}
}
