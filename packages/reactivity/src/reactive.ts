import { isObject } from "@vue/shared";

// 用于记录 代理后的结果， 可以复用
const reactiveMap = new WeakMap();

const mutableHandlers: ProxyHandler<any> = {
	get(target, key, receiver) {
		if (key === ReactiveFlags.IS_REACTIVE) {
			return true;
		}
	},
	set(target, key, value, receiver) {
		return true;
	},
};

enum ReactiveFlags {
	IS_REACTIVE = "__v_isReactive",
}

export function reactive<T extends object>(target: T) {
	return createReactiveObject(target);
}

function createReactiveObject<T extends object>(target: T) {
	// 统一做判断，响应式对象必须是对象才可以
	if (!isObject(target)) {
		return target;
	}

	// 如果是响应式对象， 直接返回
	if (target[ReactiveFlags.IS_REACTIVE]) {
		return target;
	}

	// 取缓存
	const existProxy = reactiveMap.get(target);
	if (existProxy) {
		return existProxy;
	}

	let proxy = new Proxy<T>(target, mutableHandlers);
	// 根据对象 缓存代理后的结果
	reactiveMap.set(target, proxy);
	return proxy;
}
