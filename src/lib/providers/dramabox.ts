// src/lib/providers/dramabox.ts

const BASE_URL = "https://api.sansekai.my.id/api/dramabox";

// Helper untuk format thumbnail (jika perlu proxy)
const formatCover = (url: string) => {
  if (!url) return "";
  // Jika mau pake proxy universal lu:
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};

export const dramaboxApi = {
  // 1. Home Data (VIP, DubIndo, Random, Latest, Trending, PopulerSearch, ForYou)
  async getHome(type: string = "latest", page: number = 1) {
    try {
      // Mapping type ke endpoint yang sesuai
      let endpoint = type;
      // Handle khusus jika ada parameter tambahan
      if (type === 'dubindo') endpoint = `dubindo?classify=terpopuler`;
      
      const res = await fetch(`${BASE_URL}/${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${page}`, { 
        next: { revalidate: 3600 } 
      });
      const data = await res.json();
      
      // Standardisasi output biar sama kayak Flickreels
      // API Dramabox kadang return object { columnVoList: [] } atau array langsung []
      let results = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (data.columnVoList) {
        // Kasus endpoint /vip
        results = data.columnVoList.flatMap((col: any) => col.bookList);
      }

      return {
        success: true,
        data: results.map((item: any) => ({
          bookId: item.bookId,
          title: item.bookName,
          cover: formatCover(item.coverWap || item.bookCover || item.cover), // Dramabox punya banyak nama field cover
          tags: item.tags || [],
          year: item.shelfTime ? item.shelfTime.substring(0, 4) : "2025",
          episodes: item.chapterCount,
          playCount: item.playCount
        }))
      };
    } catch (error) {
      console.error(`Dramabox ${type} Error:`, error);
      return { success: false, data: [] };
    }
  },

  // 2. Search
  async search(query: string) {
    try {
      const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, { cache: 'no-store' });
      const data = await res.json();
      return {
        success: true,
        data: Array.isArray(data) ? data.map((item: any) => ({
          bookId: item.bookId,
          title: item.bookName,
          cover: formatCover(item.cover),
          tags: item.tagNames || [], // Search pake tagNames
          author: item.author
        })) : []
      };
    } catch (error) {
      return { success: false, data: [] };
    }
  },

  // 3. Detail Drama
  async getDetail(bookId: string) {
    try {
      const res = await fetch(`${BASE_URL}/detail?bookId=${bookId}`, { next: { revalidate: 3600 } });
      const data = await res.json();
      return {
        success: true,
        data: {
          ...data,
          title: data.bookName,
          cover: formatCover(data.coverWap),
          synopsis: data.introduction,
          tags: data.tags,
          episodes_count: data.chapterCount
        }
      };
    } catch (error) {
      return { success: false, data: null };
    }
  },

  // 4. Get Episodes (Player)
  async getEpisodes(bookId: string) {
    try {
      const res = await fetch(`${BASE_URL}/allepisode?bookId=${bookId}`, { cache: 'no-store' });
      const data = await res.json();
      
      // Mapping episode list biar enak dibaca player
      return {
        success: true,
        data: Array.isArray(data) ? data.map((ep: any) => ({
          index: ep.chapterIndex,
          name: ep.chapterName,
          id: ep.chapterId,
          // Ambil video quality terbaik (1080p atau default)
          videoUrl: ep.cdnList?.[0]?.videoPathList?.find((v:any) => v.quality === 720)?.videoPath || 
                    ep.cdnList?.[0]?.videoPathList?.[0]?.videoPath || ""
        })) : []
      };
    } catch (error) {
      return { success: false, data: [] };
    }
  }
};
