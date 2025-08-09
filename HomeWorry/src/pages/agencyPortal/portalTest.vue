<template>
    <div>
        <PortalHeader/>
  <div class="portal_root">

    <div class="home_btns">
      <PortalHomeBtn
        :icon-src="portalInfoIcon"
        label="사무소 정보 관리"
      />
      <PortalHomeBtn
        :icon-src="portalListingIcon"
        label="등록 매물 관리"
      />
      <PortalHomeBtn
        :icon-src="portalQAIcon"
        label="회원 문의 관리"
      />
    </div>

    <div class="card-news-placeholder"></div>

  </div>
  </div>
</template>

<script setup>
import PortalHeader from '@/pages/agencyPortal/components/PortalHeader.vue'
import PortalHomeBtn from '@/pages/agencyPortal/components/PortalHomeBtn.vue'
import portalInfoIcon from '@/assets/icons/portal_info.png'
import portalListingIcon from '@/assets/icons/portal_listing.png'
import portalQAIcon from '@/assets/icons/portal_qa.png'
</script>

<style scoped>
.portal_root{
    padding: 2rem 2rem;
}

.home_btns {
  display: flex;
  flex-direction: column;   
  align-items: center;  
  gap: 32px;              
}

.card-news-placeholder {
  width: 393px;
  height: 150px;
  margin: 16px -32px;
  background: rgba(17, 31, 92, 0.1);
}
</style>
