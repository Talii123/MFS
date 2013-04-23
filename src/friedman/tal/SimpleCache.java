package friedman.tal;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class SimpleCache<K, V> {

	private final Map<K, V> cacheMap;
	
	public SimpleCache() {
		this.cacheMap = new ConcurrentHashMap<K, V>();
	}
	
	public void put(K aKey, V aValue) {
		this.cacheMap.put(aKey, aValue);
	}
	
	public  V get(K aKey) {
		return this.cacheMap.get(aKey);
	}
	
}
