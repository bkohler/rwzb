import { ref, onMounted } from 'vue';
import { getSunTimes, getWeatherForecast, isGoodWeather, getWeatherSummary, getDeepSeekRecommendation } from './services/api';
const runningTime = ref('');
const weatherInfo = ref('');
const isLoading = ref(true);
const error = ref('');
const deepseekRecommendation = ref(null);
const tomorrow = ref(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
const tomorrowDateString = ref(tomorrow.value.toLocaleDateString('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Zurich'
}));
onMounted(async () => {
    try {
        // Fetch both sunrise/sunset times and weather data for tomorrow
        const [sunTimes, weatherData] = await Promise.all([
            getSunTimes(true),
            getWeatherForecast(true)
        ]);
        // Parse the sunrise and sunset times
        const sunriseDate = new Date(sunTimes.results.sunrise);
        const sunsetDate = new Date(sunTimes.results.sunset);
        // Add 30 minutes to sunrise
        const startTime = new Date(sunriseDate.getTime() + 30 * 60 * 1000);
        // Subtract 30 minutes from sunset
        const endTime = new Date(sunsetDate.getTime() - 30 * 60 * 1000);
        // Format times in Swiss format
        const formatTime = (date) => {
            return date.toLocaleTimeString('de-CH', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Zurich'
            });
        };
        // Get the timestamp for tomorrow at 00:00
        const tomorrowStart = new Date();
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        tomorrowStart.setHours(0, 0, 0, 0);
        // Get the timestamp for tomorrow at 23:59
        const tomorrowEnd = new Date(tomorrowStart);
        tomorrowEnd.setHours(23, 59, 59, 999);
        // Filter forecast data to only include tomorrow's entries
        const tomorrowForecasts = weatherData.list.filter(entry => {
            const entryTime = new Date(entry.dt * 1000);
            return entryTime >= tomorrowStart && entryTime <= tomorrowEnd;
        });
        // Find good weather periods within the daylight window for tomorrow
        const goodWeatherPeriods = tomorrowForecasts.filter(entry => {
            const entryTime = new Date(entry.dt * 1000);
            return entryTime >= startTime &&
                entryTime <= endTime &&
                isGoodWeather(entry);
        });
        if (goodWeatherPeriods.length > 0) {
            // If we have good weather periods, use the first one for display
            const bestPeriod = goodWeatherPeriods[0];
            const bestPeriodTime = new Date(bestPeriod.dt * 1000);
            // Create a 2-hour window starting at the good weather time
            const windowEnd = new Date(bestPeriodTime.getTime() + 2 * 60 * 60 * 1000);
            // Make sure the window doesn't exceed daylight end
            const actualEnd = windowEnd > endTime ? endTime : windowEnd;
            runningTime.value = `${formatTime(bestPeriodTime)} - ${formatTime(actualEnd)}`;
            weatherInfo.value = getWeatherSummary(bestPeriod);
            // Get DeepSeek recommendation
            const recommendation = await getDeepSeekRecommendation(bestPeriod);
            deepseekRecommendation.value = recommendation;
        }
        else {
            // If no good weather, just display the daylight window
            runningTime.value = `${formatTime(startTime)} - ${formatTime(endTime)}`;
            weatherInfo.value = 'No optimal weather conditions found';
        }
    }
    catch (err) {
        if (err.message && err.message.includes('DeepSeek API failed')) {
            error.value = 'Failed to get DeepSeek recommendation';
        }
        else if (err instanceof Error) {
            error.value = `Error: ${err.message}`;
        }
        else {
            error.value = 'Failed to determine optimal running time';
        }
        console.error('Detailed error:', err);
    }
    finally {
        isLoading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ style: {} },
    });
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ style: {} },
    });
    (__VLS_ctx.error);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ style: {} },
    });
    (__VLS_ctx.runningTime);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ style: {} },
    });
    (__VLS_ctx.tomorrowDateString);
    if (__VLS_ctx.deepseekRecommendation) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-lg font-semibold mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid grid-cols-2 gap-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-gray-600" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.deepseekRecommendation.bestTime);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-gray-600" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.deepseekRecommendation.duration);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-gray-600" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.deepseekRecommendation.intensity);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-3 text-sm text-gray-600 italic" },
        });
        (__VLS_ctx.deepseekRecommendation.reasoning);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ style: {} },
    });
    (__VLS_ctx.weatherInfo);
}
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            runningTime: runningTime,
            weatherInfo: weatherInfo,
            isLoading: isLoading,
            error: error,
            deepseekRecommendation: deepseekRecommendation,
            tomorrowDateString: tomorrowDateString,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
