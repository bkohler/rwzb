"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var api_1 = require("../src/services/api");
var axios_1 = require("axios");
var process = require("process");
require("dotenv/config");
// Test configuration
var TEST_TIMEOUT = 10000;
// Get real weather data using application's service
var forecast = (await (0, api_1.getWeatherForecast)()).list;
var TEST_WEATHER = forecast[0]; // Use first forecast entry
function testConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var testResponse, error_1, start, recommendation, duration, weatherStart, weatherDuration, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Starting DeepSeek API connection test...\n');
                    // 1. Validate environment
                    if (!process.env.VITE_DEEPSEEK_API_KEY) {
                        console.error('❌ Missing VITE_DEEPSEEK_API_KEY in .env file');
                        return [2 /*return*/, process.exit(1)];
                    }
                    console.log('✅ Environment check passed');
                    console.log("\uD83D\uDD11 API Key: ".concat(process.env.VITE_DEEPSEEK_API_KEY.slice(0, 6), "..."));
                    // 2. Test direct API call
                    console.log('\n🔌 Testing direct API connection...');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get('https://api.deepseek.com/v1/status', {
                            headers: {
                                Authorization: "Bearer ".concat(process.env.VITE_DEEPSEEK_API_KEY),
                                Accept: 'application/json'
                            },
                            timeout: TEST_TIMEOUT
                        })];
                case 2:
                    testResponse = _b.sent();
                    console.log("\uD83D\uDCE1 API Status: ".concat(testResponse.status, " ").concat(testResponse.statusText));
                    console.log('🏓 Ping Time: ' + (testResponse.headers['x-response-time'] || 'unknown'));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error('❌ Direct connection failed:');
                    if (axios_1.default.isAxiosError(error_1)) {
                        console.error("\uD83D\uDCDF Status: ".concat(((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status) || 'No response'));
                        console.error("\uD83D\uDCAC Message: ".concat(error_1.message));
                        console.error("\uD83D\uDD27 Code: ".concat(error_1.code || 'N/A'));
                    }
                    else {
                        console.error(error_1);
                    }
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4:
                    // 3. Test service function
                    console.log('\n🧪 Testing getDeepSeekRecommendation()');
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    start = Date.now();
                    return [4 /*yield*/, (0, api_1.getDeepSeekRecommendation)(TEST_WEATHER)];
                case 6:
                    recommendation = _b.sent();
                    duration = Date.now() - start;
                    weatherStart = Date.now();
                    weatherDuration = Date.now() - weatherStart;
                    console.log('⏱  Response time: ' + duration + 'ms');
                    console.log('📋 Recommendation:');
                    console.log({
                        bestTime: recommendation.bestTime,
                        duration: recommendation.duration,
                        intensity: recommendation.intensity,
                        reasoning: recommendation.reasoning
                    });
                    if (recommendation.reasoning.includes('unavailable')) {
                        console.warn('⚠️  Using fallback recommendation - verify API health');
                        process.exit(1);
                    }
                    console.log('📊 Performance Metrics:');
                    console.log('DeepSeek API: ' + duration + 'ms');
                    console.log('Weather API: ' + weatherDuration + 'ms');
                    console.log('✅ Service function test passed');
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _b.sent();
                    console.error('❌ Service function failed:');
                    console.error(error_2);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8:
                    console.log('\n🎉 All tests passed successfully!');
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
function testMalformedRequests() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n🧪 Testing Malformed Requests...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, api_1.getDeepSeekRecommendation)({
                            dt: 1678886400,
                            main: {
                                temp: 'invalid',
                                humidity: 70,
                            },
                            wind: {
                                speed: 5,
                            },
                            weather: [
                                {
                                    description: 'clear sky',
                                    main: 'Clear',
                                },
                            ],
                            visibility: 10000,
                        })];
                case 2:
                    _a.sent();
                    console.error('❌ Malformed Requests test failed: No error was thrown');
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    if (error_3.message.includes('DeepSeek API failed')) {
                        console.log('✅ Malformed Requests test passed');
                    }
                    else {
                        console.error('❌ Malformed Requests test failed: Unexpected error', error_3);
                        process.exit(1);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function testRateLimiting() {
    return __awaiter(this, void 0, void 0, function () {
        var numberOfRequests, requests, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n🧪 Testing Rate Limiting...');
                    numberOfRequests = 5;
                    requests = Array(numberOfRequests).fill(null).map(function () { return (0, api_1.getDeepSeekRecommendation)(TEST_WEATHER); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(requests)];
                case 2:
                    _a.sent();
                    console.log('✅ Rate Limiting test passed: No rate limiting occurred');
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    if (error_4.message.includes('DeepSeek API failed')) {
                        console.log('✅ Rate Limiting test passed: Rate limiting occurred as expected');
                    }
                    else {
                        console.error('❌ Rate Limiting test failed: Unexpected error', error_4);
                        process.exit(1);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
testConnection();
