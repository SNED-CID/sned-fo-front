import { Injectable } from '@angular/core';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor() {
    window.dataLayer = window.dataLayer || [];
  }

  private pushEvent(event: string, parameters?: Record<string, any>) {
    try {
      window.dataLayer.push({
        event,
        ...parameters,
        timestamp: new Date().toISOString()
      });
      console.log('Analytics Event:', event, parameters);
    } catch (error) {
      console.warn('Failed to push analytics event:', error);
    }
  }

  trackPageView(pagePath: string, pageTitle: string) {
    this.pushEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href
    });
  }

  trackLanguageChange(fromLang: string, toLang: string) {
    this.pushEvent('language_change', {
      from_language: fromLang,
      to_language: toLang
    });
  }

  trackMenuClick(menuLabel: string, menuRoute: string, hasChildren: boolean = false) {
    this.pushEvent('menu_click', {
      menu_label: menuLabel,
      menu_route: menuRoute,
      menu_type: hasChildren ? 'dropdown' : 'direct',
      click_location: 'header'
    });
  }

  trackSubmenuClick(parentLabel: string, childLabel: string, route: string) {
    this.pushEvent('submenu_click', {
      parent_menu: parentLabel,
      submenu_label: childLabel,
      submenu_route: route,
      click_location: 'header_dropdown'
    });
  }

  trackReadMoreOpen(contentType: 'section' | 'tender', title: string, sectionId?: string) {
    this.pushEvent('read_more_open', {
      content_type: contentType,
      content_title: title,
      section_id: sectionId || 'N/A'
    });
  }

  trackReadMoreClose(contentType: 'section' | 'tender', title: string, timeSpent?: number) {
    this.pushEvent('read_more_close', {
      content_type: contentType,
      content_title: title,
      time_spent_seconds: timeSpent || 0
    });
  }

  trackShare(contentType: 'section' | 'tender', contentTitle: string, shareMethod: 'native' | 'clipboard') {
    this.pushEvent('content_share', {
      content_type: contentType,
      content_title: contentTitle,
      share_method: shareMethod
    });
  }

  trackTenderOpen(tenderNumber: string, tenderDate?: Date) {
    this.pushEvent('tender_open', {
      tender_number: tenderNumber,
      tender_date: tenderDate ? tenderDate.toISOString() : 'N/A'
    });
  }

  trackNextSectionNavigation(currentSection: string, nextSection: string) {
    this.pushEvent('next_section_navigation', {
      from_section: currentSection,
      to_section: nextSection,
      navigation_type: 'footer_button'
    });
  }

  trackAnchorScroll(sectionId: string, sectionLabel: string) {
    this.pushEvent('anchor_scroll', {
      section_id: sectionId,
      section_label: sectionLabel,
      navigation_type: 'anchor_menu'
    });
  }

  trackFileDownload(fileName: string, fileType: string, fileUrl: string) {
    this.pushEvent('file_download', {
      file_name: fileName,
      file_type: fileType,
      file_url: fileUrl
    });
  }

  trackCTAClick(ctaLabel: string, ctaLocation: string, targetUrl?: string) {
    this.pushEvent('cta_click', {
      cta_label: ctaLabel,
      cta_location: ctaLocation,
      target_url: targetUrl || 'N/A'
    });
  }

  trackSearch(searchTerm: string, resultsCount: number) {
    this.pushEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  trackError(errorType: string, errorMessage: string, errorPage: string) {
    this.pushEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      error_page: errorPage
    });
  }

  trackPartnerClick(partnerName: string, partnerType: 'national' | 'international') {
    this.pushEvent('partner_click', {
      partner_name: partnerName,
      partner_type: partnerType
    });
  }

  trackGalleryInteraction(interactionType: 'open' | 'next' | 'previous' | 'close', imageIndex?: number) {
    this.pushEvent('gallery_interaction', {
      interaction_type: interactionType,
      image_index: imageIndex || 0
    });
  }

  trackTimeOnPage(pagePath: string, timeSpentSeconds: number) {
    this.pushEvent('time_on_page', {
      page_path: pagePath,
      time_spent_seconds: timeSpentSeconds
    });
  }

  trackDynamicNavigation(fromMenu: string, toMenu: string) {
    this.pushEvent('dynamic_navigation', {
      from_menu: fromMenu,
      to_menu: toMenu,
      navigation_source: 'hero_button'
    });
  }

  trackMobileMenuToggle(action: 'open' | 'close') {
    this.pushEvent('mobile_menu_toggle', {
      action: action
    });
  }

  trackMobileDropdownToggle(menuLabel: string, action: 'open' | 'close') {
    this.pushEvent('mobile_dropdown_toggle', {
      menu_label: menuLabel,
      action: action
    });
  }
}
