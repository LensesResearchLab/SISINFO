'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">sisinfo documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AreasOfInterestModule.html" data-type="entity-link" >AreasOfInterestModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AreasOfInterestModule-81f92454e68d4b815385edae2293dc9ba796594777e5fee10eaaa47236b320db34d9e9cf7ae8c35322757ca4d985b7f07846ca184bc3f8a652aad0fb335506d1"' : 'data-bs-target="#xs-controllers-links-module-AreasOfInterestModule-81f92454e68d4b815385edae2293dc9ba796594777e5fee10eaaa47236b320db34d9e9cf7ae8c35322757ca4d985b7f07846ca184bc3f8a652aad0fb335506d1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AreasOfInterestModule-81f92454e68d4b815385edae2293dc9ba796594777e5fee10eaaa47236b320db34d9e9cf7ae8c35322757ca4d985b7f07846ca184bc3f8a652aad0fb335506d1"' :
                                            'id="xs-controllers-links-module-AreasOfInterestModule-81f92454e68d4b815385edae2293dc9ba796594777e5fee10eaaa47236b320db34d9e9cf7ae8c35322757ca4d985b7f07846ca184bc3f8a652aad0fb335506d1"' }>
                                            <li class="link">
                                                <a href="controllers/AreasOfInterestController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AreasOfInterestController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AreasOfInterestModule-81f92454e68d4b815385edae2293dc9ba796594777e5fee10eaaa47236b320db34d9e9cf7ae8c35322757ca4d985b7f07846ca184bc3f8a652aad0fb335506d1"' : 'data-bs-target="#xs-injectables-links-module-AreasOfInterestModule-81f92454e68d4b815385edae2293dc9ba796594777e5fee10eaaa47236b320db34d9e9cf7ae8c35322757ca4d985b7f07846ca184bc3f8a652aad0fb335506d1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AreasOfInterestModule-81f92454e68d4b815385edae2293dc9ba796594777e5fee10eaaa47236b320db34d9e9cf7ae8c35322757ca4d985b7f07846ca184bc3f8a652aad0fb335506d1"' :
                                        'id="xs-injectables-links-module-AreasOfInterestModule-81f92454e68d4b815385edae2293dc9ba796594777e5fee10eaaa47236b320db34d9e9cf7ae8c35322757ca4d985b7f07846ca184bc3f8a652aad0fb335506d1"' }>
                                        <li class="link">
                                            <a href="injectables/AreasOfInterestService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AreasOfInterestService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AssistanceApplicationsModule.html" data-type="entity-link" >AssistanceApplicationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AssistanceApplicationsModule-c82d37f9399214ec70fb838ec76747ba283bdb33fbe4debcb5333cabd72a00151c569efded4f50e053bcbf8218f2a8e5362180a9cbffbf12b93ec8477f283564"' : 'data-bs-target="#xs-controllers-links-module-AssistanceApplicationsModule-c82d37f9399214ec70fb838ec76747ba283bdb33fbe4debcb5333cabd72a00151c569efded4f50e053bcbf8218f2a8e5362180a9cbffbf12b93ec8477f283564"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AssistanceApplicationsModule-c82d37f9399214ec70fb838ec76747ba283bdb33fbe4debcb5333cabd72a00151c569efded4f50e053bcbf8218f2a8e5362180a9cbffbf12b93ec8477f283564"' :
                                            'id="xs-controllers-links-module-AssistanceApplicationsModule-c82d37f9399214ec70fb838ec76747ba283bdb33fbe4debcb5333cabd72a00151c569efded4f50e053bcbf8218f2a8e5362180a9cbffbf12b93ec8477f283564"' }>
                                            <li class="link">
                                                <a href="controllers/AssistanceApplicationsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AssistanceApplicationsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AssistanceApplicationsModule-c82d37f9399214ec70fb838ec76747ba283bdb33fbe4debcb5333cabd72a00151c569efded4f50e053bcbf8218f2a8e5362180a9cbffbf12b93ec8477f283564"' : 'data-bs-target="#xs-injectables-links-module-AssistanceApplicationsModule-c82d37f9399214ec70fb838ec76747ba283bdb33fbe4debcb5333cabd72a00151c569efded4f50e053bcbf8218f2a8e5362180a9cbffbf12b93ec8477f283564"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AssistanceApplicationsModule-c82d37f9399214ec70fb838ec76747ba283bdb33fbe4debcb5333cabd72a00151c569efded4f50e053bcbf8218f2a8e5362180a9cbffbf12b93ec8477f283564"' :
                                        'id="xs-injectables-links-module-AssistanceApplicationsModule-c82d37f9399214ec70fb838ec76747ba283bdb33fbe4debcb5333cabd72a00151c569efded4f50e053bcbf8218f2a8e5362180a9cbffbf12b93ec8477f283564"' }>
                                        <li class="link">
                                            <a href="injectables/AssistanceApplicationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AssistanceApplicationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BillboardsModule.html" data-type="entity-link" >BillboardsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BillboardsModule-b2776f13022c2eebbf43064e4dbe6d101e83effa532179ee91152e754f3aa9c976e53f72926cc36bd5dd3dc73d8c0e473a001bb8bda6df651578f9278fa6f6cc"' : 'data-bs-target="#xs-controllers-links-module-BillboardsModule-b2776f13022c2eebbf43064e4dbe6d101e83effa532179ee91152e754f3aa9c976e53f72926cc36bd5dd3dc73d8c0e473a001bb8bda6df651578f9278fa6f6cc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BillboardsModule-b2776f13022c2eebbf43064e4dbe6d101e83effa532179ee91152e754f3aa9c976e53f72926cc36bd5dd3dc73d8c0e473a001bb8bda6df651578f9278fa6f6cc"' :
                                            'id="xs-controllers-links-module-BillboardsModule-b2776f13022c2eebbf43064e4dbe6d101e83effa532179ee91152e754f3aa9c976e53f72926cc36bd5dd3dc73d8c0e473a001bb8bda6df651578f9278fa6f6cc"' }>
                                            <li class="link">
                                                <a href="controllers/BillboardsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BillboardsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BillboardsModule-b2776f13022c2eebbf43064e4dbe6d101e83effa532179ee91152e754f3aa9c976e53f72926cc36bd5dd3dc73d8c0e473a001bb8bda6df651578f9278fa6f6cc"' : 'data-bs-target="#xs-injectables-links-module-BillboardsModule-b2776f13022c2eebbf43064e4dbe6d101e83effa532179ee91152e754f3aa9c976e53f72926cc36bd5dd3dc73d8c0e473a001bb8bda6df651578f9278fa6f6cc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BillboardsModule-b2776f13022c2eebbf43064e4dbe6d101e83effa532179ee91152e754f3aa9c976e53f72926cc36bd5dd3dc73d8c0e473a001bb8bda6df651578f9278fa6f6cc"' :
                                        'id="xs-injectables-links-module-BillboardsModule-b2776f13022c2eebbf43064e4dbe6d101e83effa532179ee91152e754f3aa9c976e53f72926cc36bd5dd3dc73d8c0e473a001bb8bda6df651578f9278fa6f6cc"' }>
                                        <li class="link">
                                            <a href="injectables/BillboardsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BillboardsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoordinatorsModule.html" data-type="entity-link" >CoordinatorsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CoordinatorsModule-7d2bf85f1c41bde6b28b30c1618d81a0d324459a1d62eb695e3f5888606986ee6d5312fc057c6c0497e3c9ae6748ca14a477118fda8ea1ef0542821715165b63"' : 'data-bs-target="#xs-controllers-links-module-CoordinatorsModule-7d2bf85f1c41bde6b28b30c1618d81a0d324459a1d62eb695e3f5888606986ee6d5312fc057c6c0497e3c9ae6748ca14a477118fda8ea1ef0542821715165b63"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CoordinatorsModule-7d2bf85f1c41bde6b28b30c1618d81a0d324459a1d62eb695e3f5888606986ee6d5312fc057c6c0497e3c9ae6748ca14a477118fda8ea1ef0542821715165b63"' :
                                            'id="xs-controllers-links-module-CoordinatorsModule-7d2bf85f1c41bde6b28b30c1618d81a0d324459a1d62eb695e3f5888606986ee6d5312fc057c6c0497e3c9ae6748ca14a477118fda8ea1ef0542821715165b63"' }>
                                            <li class="link">
                                                <a href="controllers/CoordinatorsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CoordinatorsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CoordinatorsModule-7d2bf85f1c41bde6b28b30c1618d81a0d324459a1d62eb695e3f5888606986ee6d5312fc057c6c0497e3c9ae6748ca14a477118fda8ea1ef0542821715165b63"' : 'data-bs-target="#xs-injectables-links-module-CoordinatorsModule-7d2bf85f1c41bde6b28b30c1618d81a0d324459a1d62eb695e3f5888606986ee6d5312fc057c6c0497e3c9ae6748ca14a477118fda8ea1ef0542821715165b63"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoordinatorsModule-7d2bf85f1c41bde6b28b30c1618d81a0d324459a1d62eb695e3f5888606986ee6d5312fc057c6c0497e3c9ae6748ca14a477118fda8ea1ef0542821715165b63"' :
                                        'id="xs-injectables-links-module-CoordinatorsModule-7d2bf85f1c41bde6b28b30c1618d81a0d324459a1d62eb695e3f5888606986ee6d5312fc057c6c0497e3c9ae6748ca14a477118fda8ea1ef0542821715165b63"' }>
                                        <li class="link">
                                            <a href="injectables/CoordinatorsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CoordinatorsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoursesModule.html" data-type="entity-link" >CoursesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CoursesModule-a713d64915c24e59b8a5cea5658099533e5d2961d0f93e8d79f4cd606f81b979994e9099158bf61b4c8cb049db78563c9fed0809d74a1aa8bc98189186cee83e"' : 'data-bs-target="#xs-controllers-links-module-CoursesModule-a713d64915c24e59b8a5cea5658099533e5d2961d0f93e8d79f4cd606f81b979994e9099158bf61b4c8cb049db78563c9fed0809d74a1aa8bc98189186cee83e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CoursesModule-a713d64915c24e59b8a5cea5658099533e5d2961d0f93e8d79f4cd606f81b979994e9099158bf61b4c8cb049db78563c9fed0809d74a1aa8bc98189186cee83e"' :
                                            'id="xs-controllers-links-module-CoursesModule-a713d64915c24e59b8a5cea5658099533e5d2961d0f93e8d79f4cd606f81b979994e9099158bf61b4c8cb049db78563c9fed0809d74a1aa8bc98189186cee83e"' }>
                                            <li class="link">
                                                <a href="controllers/CourseController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CourseController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CoursesModule-a713d64915c24e59b8a5cea5658099533e5d2961d0f93e8d79f4cd606f81b979994e9099158bf61b4c8cb049db78563c9fed0809d74a1aa8bc98189186cee83e"' : 'data-bs-target="#xs-injectables-links-module-CoursesModule-a713d64915c24e59b8a5cea5658099533e5d2961d0f93e8d79f4cd606f81b979994e9099158bf61b4c8cb049db78563c9fed0809d74a1aa8bc98189186cee83e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoursesModule-a713d64915c24e59b8a5cea5658099533e5d2961d0f93e8d79f4cd606f81b979994e9099158bf61b4c8cb049db78563c9fed0809d74a1aa8bc98189186cee83e"' :
                                        'id="xs-injectables-links-module-CoursesModule-a713d64915c24e59b8a5cea5658099533e5d2961d0f93e8d79f4cd606f81b979994e9099158bf61b4c8cb049db78563c9fed0809d74a1aa8bc98189186cee83e"' }>
                                        <li class="link">
                                            <a href="injectables/CoursesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CoursesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DocumentsModule.html" data-type="entity-link" >DocumentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-DocumentsModule-22e562cc6f8d47e4a5e534df6a9c06b29d24f4a39c9e5f5cec45ba20d14261a37b8f08229dba822352cc779df408e9a55f2f8550dbba475d12044e64f38c393e"' : 'data-bs-target="#xs-controllers-links-module-DocumentsModule-22e562cc6f8d47e4a5e534df6a9c06b29d24f4a39c9e5f5cec45ba20d14261a37b8f08229dba822352cc779df408e9a55f2f8550dbba475d12044e64f38c393e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DocumentsModule-22e562cc6f8d47e4a5e534df6a9c06b29d24f4a39c9e5f5cec45ba20d14261a37b8f08229dba822352cc779df408e9a55f2f8550dbba475d12044e64f38c393e"' :
                                            'id="xs-controllers-links-module-DocumentsModule-22e562cc6f8d47e4a5e534df6a9c06b29d24f4a39c9e5f5cec45ba20d14261a37b8f08229dba822352cc779df408e9a55f2f8550dbba475d12044e64f38c393e"' }>
                                            <li class="link">
                                                <a href="controllers/DocumentsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DocumentsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DocumentsModule-22e562cc6f8d47e4a5e534df6a9c06b29d24f4a39c9e5f5cec45ba20d14261a37b8f08229dba822352cc779df408e9a55f2f8550dbba475d12044e64f38c393e"' : 'data-bs-target="#xs-injectables-links-module-DocumentsModule-22e562cc6f8d47e4a5e534df6a9c06b29d24f4a39c9e5f5cec45ba20d14261a37b8f08229dba822352cc779df408e9a55f2f8550dbba475d12044e64f38c393e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DocumentsModule-22e562cc6f8d47e4a5e534df6a9c06b29d24f4a39c9e5f5cec45ba20d14261a37b8f08229dba822352cc779df408e9a55f2f8550dbba475d12044e64f38c393e"' :
                                        'id="xs-injectables-links-module-DocumentsModule-22e562cc6f8d47e4a5e534df6a9c06b29d24f4a39c9e5f5cec45ba20d14261a37b8f08229dba822352cc779df408e9a55f2f8550dbba475d12044e64f38c393e"' }>
                                        <li class="link">
                                            <a href="injectables/DocumentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DocumentsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GraduatedAssistancesModule.html" data-type="entity-link" >GraduatedAssistancesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GraduatedAssistancesModule-4710cd41521c7cecc7a9c60592cd33403514c00cd76e4e75696f3e49cb47a0f8426214111656c9655a58d67ae40051562fd67127ace6e61e6c165e73a3f124b6"' : 'data-bs-target="#xs-controllers-links-module-GraduatedAssistancesModule-4710cd41521c7cecc7a9c60592cd33403514c00cd76e4e75696f3e49cb47a0f8426214111656c9655a58d67ae40051562fd67127ace6e61e6c165e73a3f124b6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GraduatedAssistancesModule-4710cd41521c7cecc7a9c60592cd33403514c00cd76e4e75696f3e49cb47a0f8426214111656c9655a58d67ae40051562fd67127ace6e61e6c165e73a3f124b6"' :
                                            'id="xs-controllers-links-module-GraduatedAssistancesModule-4710cd41521c7cecc7a9c60592cd33403514c00cd76e4e75696f3e49cb47a0f8426214111656c9655a58d67ae40051562fd67127ace6e61e6c165e73a3f124b6"' }>
                                            <li class="link">
                                                <a href="controllers/GraduatedAssistancesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GraduatedAssistancesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GraduatedAssistancesModule-4710cd41521c7cecc7a9c60592cd33403514c00cd76e4e75696f3e49cb47a0f8426214111656c9655a58d67ae40051562fd67127ace6e61e6c165e73a3f124b6"' : 'data-bs-target="#xs-injectables-links-module-GraduatedAssistancesModule-4710cd41521c7cecc7a9c60592cd33403514c00cd76e4e75696f3e49cb47a0f8426214111656c9655a58d67ae40051562fd67127ace6e61e6c165e73a3f124b6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GraduatedAssistancesModule-4710cd41521c7cecc7a9c60592cd33403514c00cd76e4e75696f3e49cb47a0f8426214111656c9655a58d67ae40051562fd67127ace6e61e6c165e73a3f124b6"' :
                                        'id="xs-injectables-links-module-GraduatedAssistancesModule-4710cd41521c7cecc7a9c60592cd33403514c00cd76e4e75696f3e49cb47a0f8426214111656c9655a58d67ae40051562fd67127ace6e61e6c165e73a3f124b6"' }>
                                        <li class="link">
                                            <a href="injectables/GraduatedAssistancesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GraduatedAssistancesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ImportantDatesModule.html" data-type="entity-link" >ImportantDatesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ImportantDatesModule-a51b167644d5e50db63e374f5afa862e9fb05362b648de1b48e007397494c391daee142543173b39355434cd952a57dbfb81a6d768c395f9cb2a7e1423f4e7c7"' : 'data-bs-target="#xs-controllers-links-module-ImportantDatesModule-a51b167644d5e50db63e374f5afa862e9fb05362b648de1b48e007397494c391daee142543173b39355434cd952a57dbfb81a6d768c395f9cb2a7e1423f4e7c7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ImportantDatesModule-a51b167644d5e50db63e374f5afa862e9fb05362b648de1b48e007397494c391daee142543173b39355434cd952a57dbfb81a6d768c395f9cb2a7e1423f4e7c7"' :
                                            'id="xs-controllers-links-module-ImportantDatesModule-a51b167644d5e50db63e374f5afa862e9fb05362b648de1b48e007397494c391daee142543173b39355434cd952a57dbfb81a6d768c395f9cb2a7e1423f4e7c7"' }>
                                            <li class="link">
                                                <a href="controllers/ImportantDatesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportantDatesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ImportantDatesModule-a51b167644d5e50db63e374f5afa862e9fb05362b648de1b48e007397494c391daee142543173b39355434cd952a57dbfb81a6d768c395f9cb2a7e1423f4e7c7"' : 'data-bs-target="#xs-injectables-links-module-ImportantDatesModule-a51b167644d5e50db63e374f5afa862e9fb05362b648de1b48e007397494c391daee142543173b39355434cd952a57dbfb81a6d768c395f9cb2a7e1423f4e7c7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ImportantDatesModule-a51b167644d5e50db63e374f5afa862e9fb05362b648de1b48e007397494c391daee142543173b39355434cd952a57dbfb81a6d768c395f9cb2a7e1423f4e7c7"' :
                                        'id="xs-injectables-links-module-ImportantDatesModule-a51b167644d5e50db63e374f5afa862e9fb05362b648de1b48e007397494c391daee142543173b39355434cd952a57dbfb81a6d768c395f9cb2a7e1423f4e7c7"' }>
                                        <li class="link">
                                            <a href="injectables/ImportantDatesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportantDatesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/IncidencesModule.html" data-type="entity-link" >IncidencesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-IncidencesModule-0a70f48b66e9ce2a918aa284766f290cb503ba67767f645ffcdc3a542d48a458a7e89647d02855038adb627c2cdc8749ce569f84f2ab9e3181576d1fb045eed4"' : 'data-bs-target="#xs-controllers-links-module-IncidencesModule-0a70f48b66e9ce2a918aa284766f290cb503ba67767f645ffcdc3a542d48a458a7e89647d02855038adb627c2cdc8749ce569f84f2ab9e3181576d1fb045eed4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-IncidencesModule-0a70f48b66e9ce2a918aa284766f290cb503ba67767f645ffcdc3a542d48a458a7e89647d02855038adb627c2cdc8749ce569f84f2ab9e3181576d1fb045eed4"' :
                                            'id="xs-controllers-links-module-IncidencesModule-0a70f48b66e9ce2a918aa284766f290cb503ba67767f645ffcdc3a542d48a458a7e89647d02855038adb627c2cdc8749ce569f84f2ab9e3181576d1fb045eed4"' }>
                                            <li class="link">
                                                <a href="controllers/IncidencesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IncidencesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-IncidencesModule-0a70f48b66e9ce2a918aa284766f290cb503ba67767f645ffcdc3a542d48a458a7e89647d02855038adb627c2cdc8749ce569f84f2ab9e3181576d1fb045eed4"' : 'data-bs-target="#xs-injectables-links-module-IncidencesModule-0a70f48b66e9ce2a918aa284766f290cb503ba67767f645ffcdc3a542d48a458a7e89647d02855038adb627c2cdc8749ce569f84f2ab9e3181576d1fb045eed4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-IncidencesModule-0a70f48b66e9ce2a918aa284766f290cb503ba67767f645ffcdc3a542d48a458a7e89647d02855038adb627c2cdc8749ce569f84f2ab9e3181576d1fb045eed4"' :
                                        'id="xs-injectables-links-module-IncidencesModule-0a70f48b66e9ce2a918aa284766f290cb503ba67767f645ffcdc3a542d48a458a7e89647d02855038adb627c2cdc8749ce569f84f2ab9e3181576d1fb045eed4"' }>
                                        <li class="link">
                                            <a href="injectables/IncidencesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IncidencesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PeriodsModule.html" data-type="entity-link" >PeriodsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PeriodsModule-c029b08e5c1077bef29efae893013f2d136210945965813ab3e60951b13a6ad11cdf3ee92198dfa7b3d7f69d2aab74d44e4b38b31c75ea6cc96f3984858433a1"' : 'data-bs-target="#xs-controllers-links-module-PeriodsModule-c029b08e5c1077bef29efae893013f2d136210945965813ab3e60951b13a6ad11cdf3ee92198dfa7b3d7f69d2aab74d44e4b38b31c75ea6cc96f3984858433a1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PeriodsModule-c029b08e5c1077bef29efae893013f2d136210945965813ab3e60951b13a6ad11cdf3ee92198dfa7b3d7f69d2aab74d44e4b38b31c75ea6cc96f3984858433a1"' :
                                            'id="xs-controllers-links-module-PeriodsModule-c029b08e5c1077bef29efae893013f2d136210945965813ab3e60951b13a6ad11cdf3ee92198dfa7b3d7f69d2aab74d44e4b38b31c75ea6cc96f3984858433a1"' }>
                                            <li class="link">
                                                <a href="controllers/PeriodsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PeriodsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PeriodsModule-c029b08e5c1077bef29efae893013f2d136210945965813ab3e60951b13a6ad11cdf3ee92198dfa7b3d7f69d2aab74d44e4b38b31c75ea6cc96f3984858433a1"' : 'data-bs-target="#xs-injectables-links-module-PeriodsModule-c029b08e5c1077bef29efae893013f2d136210945965813ab3e60951b13a6ad11cdf3ee92198dfa7b3d7f69d2aab74d44e4b38b31c75ea6cc96f3984858433a1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PeriodsModule-c029b08e5c1077bef29efae893013f2d136210945965813ab3e60951b13a6ad11cdf3ee92198dfa7b3d7f69d2aab74d44e4b38b31c75ea6cc96f3984858433a1"' :
                                        'id="xs-injectables-links-module-PeriodsModule-c029b08e5c1077bef29efae893013f2d136210945965813ab3e60951b13a6ad11cdf3ee92198dfa7b3d7f69d2aab74d44e4b38b31c75ea6cc96f3984858433a1"' }>
                                        <li class="link">
                                            <a href="injectables/PeriodsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PeriodsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfessorsModule.html" data-type="entity-link" >ProfessorsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProfessorsModule-912678041340b67e8c6ee39daa5ec3ce9fb53e58817430b0b07fdaae7c44c14a0d8ce0559a07c819c9f0d6cb4f5887f13ed3938211eb825e545198dd867a23bd"' : 'data-bs-target="#xs-controllers-links-module-ProfessorsModule-912678041340b67e8c6ee39daa5ec3ce9fb53e58817430b0b07fdaae7c44c14a0d8ce0559a07c819c9f0d6cb4f5887f13ed3938211eb825e545198dd867a23bd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfessorsModule-912678041340b67e8c6ee39daa5ec3ce9fb53e58817430b0b07fdaae7c44c14a0d8ce0559a07c819c9f0d6cb4f5887f13ed3938211eb825e545198dd867a23bd"' :
                                            'id="xs-controllers-links-module-ProfessorsModule-912678041340b67e8c6ee39daa5ec3ce9fb53e58817430b0b07fdaae7c44c14a0d8ce0559a07c819c9f0d6cb4f5887f13ed3938211eb825e545198dd867a23bd"' }>
                                            <li class="link">
                                                <a href="controllers/ProfessorsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfessorsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProfessorsModule-912678041340b67e8c6ee39daa5ec3ce9fb53e58817430b0b07fdaae7c44c14a0d8ce0559a07c819c9f0d6cb4f5887f13ed3938211eb825e545198dd867a23bd"' : 'data-bs-target="#xs-injectables-links-module-ProfessorsModule-912678041340b67e8c6ee39daa5ec3ce9fb53e58817430b0b07fdaae7c44c14a0d8ce0559a07c819c9f0d6cb4f5887f13ed3938211eb825e545198dd867a23bd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfessorsModule-912678041340b67e8c6ee39daa5ec3ce9fb53e58817430b0b07fdaae7c44c14a0d8ce0559a07c819c9f0d6cb4f5887f13ed3938211eb825e545198dd867a23bd"' :
                                        'id="xs-injectables-links-module-ProfessorsModule-912678041340b67e8c6ee39daa5ec3ce9fb53e58817430b0b07fdaae7c44c14a0d8ce0559a07c819c9f0d6cb4f5887f13ed3938211eb825e545198dd867a23bd"' }>
                                        <li class="link">
                                            <a href="injectables/ProfessorsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfessorsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProgramsModule.html" data-type="entity-link" >ProgramsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProgramsModule-d31ea870f4627005826befebad2cf7b18d5157335744375be29bf07590a583512f10a6bcede41a805cb0e7fe003e23b6dccfa8e0d7ecdbdbd15ea2cfa2605d40"' : 'data-bs-target="#xs-controllers-links-module-ProgramsModule-d31ea870f4627005826befebad2cf7b18d5157335744375be29bf07590a583512f10a6bcede41a805cb0e7fe003e23b6dccfa8e0d7ecdbdbd15ea2cfa2605d40"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProgramsModule-d31ea870f4627005826befebad2cf7b18d5157335744375be29bf07590a583512f10a6bcede41a805cb0e7fe003e23b6dccfa8e0d7ecdbdbd15ea2cfa2605d40"' :
                                            'id="xs-controllers-links-module-ProgramsModule-d31ea870f4627005826befebad2cf7b18d5157335744375be29bf07590a583512f10a6bcede41a805cb0e7fe003e23b6dccfa8e0d7ecdbdbd15ea2cfa2605d40"' }>
                                            <li class="link">
                                                <a href="controllers/ProgramsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProgramsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProgramsModule-d31ea870f4627005826befebad2cf7b18d5157335744375be29bf07590a583512f10a6bcede41a805cb0e7fe003e23b6dccfa8e0d7ecdbdbd15ea2cfa2605d40"' : 'data-bs-target="#xs-injectables-links-module-ProgramsModule-d31ea870f4627005826befebad2cf7b18d5157335744375be29bf07590a583512f10a6bcede41a805cb0e7fe003e23b6dccfa8e0d7ecdbdbd15ea2cfa2605d40"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProgramsModule-d31ea870f4627005826befebad2cf7b18d5157335744375be29bf07590a583512f10a6bcede41a805cb0e7fe003e23b6dccfa8e0d7ecdbdbd15ea2cfa2605d40"' :
                                        'id="xs-injectables-links-module-ProgramsModule-d31ea870f4627005826befebad2cf7b18d5157335744375be29bf07590a583512f10a6bcede41a805cb0e7fe003e23b6dccfa8e0d7ecdbdbd15ea2cfa2605d40"' }>
                                        <li class="link">
                                            <a href="injectables/ProgramsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProgramsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectApplicationsModule.html" data-type="entity-link" >ProjectApplicationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProjectApplicationsModule-369a9fa16ecb801a7fb617ae2f3f11bcdb647bb94b5608f68f222cfd4e9be0fca313184acb1f21c9dbc15d48e8ac2f961d6993a9a3fd7b00071cb7caa90dee37"' : 'data-bs-target="#xs-controllers-links-module-ProjectApplicationsModule-369a9fa16ecb801a7fb617ae2f3f11bcdb647bb94b5608f68f222cfd4e9be0fca313184acb1f21c9dbc15d48e8ac2f961d6993a9a3fd7b00071cb7caa90dee37"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectApplicationsModule-369a9fa16ecb801a7fb617ae2f3f11bcdb647bb94b5608f68f222cfd4e9be0fca313184acb1f21c9dbc15d48e8ac2f961d6993a9a3fd7b00071cb7caa90dee37"' :
                                            'id="xs-controllers-links-module-ProjectApplicationsModule-369a9fa16ecb801a7fb617ae2f3f11bcdb647bb94b5608f68f222cfd4e9be0fca313184acb1f21c9dbc15d48e8ac2f961d6993a9a3fd7b00071cb7caa90dee37"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectApplicationsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectApplicationsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectApplicationsModule-369a9fa16ecb801a7fb617ae2f3f11bcdb647bb94b5608f68f222cfd4e9be0fca313184acb1f21c9dbc15d48e8ac2f961d6993a9a3fd7b00071cb7caa90dee37"' : 'data-bs-target="#xs-injectables-links-module-ProjectApplicationsModule-369a9fa16ecb801a7fb617ae2f3f11bcdb647bb94b5608f68f222cfd4e9be0fca313184acb1f21c9dbc15d48e8ac2f961d6993a9a3fd7b00071cb7caa90dee37"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectApplicationsModule-369a9fa16ecb801a7fb617ae2f3f11bcdb647bb94b5608f68f222cfd4e9be0fca313184acb1f21c9dbc15d48e8ac2f961d6993a9a3fd7b00071cb7caa90dee37"' :
                                        'id="xs-injectables-links-module-ProjectApplicationsModule-369a9fa16ecb801a7fb617ae2f3f11bcdb647bb94b5608f68f222cfd4e9be0fca313184acb1f21c9dbc15d48e8ac2f961d6993a9a3fd7b00071cb7caa90dee37"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectApplicationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectApplicationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectsModule.html" data-type="entity-link" >ProjectsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProjectsModule-12234f3046520126f28273d223050be248b3ce5051492e3cd47064152c2fdd9513f7bf8f3d6f6efe87dbc5033bddd6822933a756cdf0cdd007216d8ad39d3628"' : 'data-bs-target="#xs-controllers-links-module-ProjectsModule-12234f3046520126f28273d223050be248b3ce5051492e3cd47064152c2fdd9513f7bf8f3d6f6efe87dbc5033bddd6822933a756cdf0cdd007216d8ad39d3628"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectsModule-12234f3046520126f28273d223050be248b3ce5051492e3cd47064152c2fdd9513f7bf8f3d6f6efe87dbc5033bddd6822933a756cdf0cdd007216d8ad39d3628"' :
                                            'id="xs-controllers-links-module-ProjectsModule-12234f3046520126f28273d223050be248b3ce5051492e3cd47064152c2fdd9513f7bf8f3d6f6efe87dbc5033bddd6822933a756cdf0cdd007216d8ad39d3628"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectsModule-12234f3046520126f28273d223050be248b3ce5051492e3cd47064152c2fdd9513f7bf8f3d6f6efe87dbc5033bddd6822933a756cdf0cdd007216d8ad39d3628"' : 'data-bs-target="#xs-injectables-links-module-ProjectsModule-12234f3046520126f28273d223050be248b3ce5051492e3cd47064152c2fdd9513f7bf8f3d6f6efe87dbc5033bddd6822933a756cdf0cdd007216d8ad39d3628"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectsModule-12234f3046520126f28273d223050be248b3ce5051492e3cd47064152c2fdd9513f7bf8f3d6f6efe87dbc5033bddd6822933a756cdf0cdd007216d8ad39d3628"' :
                                        'id="xs-injectables-links-module-ProjectsModule-12234f3046520126f28273d223050be248b3ce5051492e3cd47064152c2fdd9513f7bf8f3d6f6efe87dbc5033bddd6822933a756cdf0cdd007216d8ad39d3628"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RequirementsModule.html" data-type="entity-link" >RequirementsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RequirementsModule-e12a14f9f06fefd07940da367d77ea410cde0b7564f10531581e3fb8cddbb0d90fa64278e7d9fa93e0e50365321c6e84fe924fe7c1740fda7bf724ec5659345d"' : 'data-bs-target="#xs-controllers-links-module-RequirementsModule-e12a14f9f06fefd07940da367d77ea410cde0b7564f10531581e3fb8cddbb0d90fa64278e7d9fa93e0e50365321c6e84fe924fe7c1740fda7bf724ec5659345d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RequirementsModule-e12a14f9f06fefd07940da367d77ea410cde0b7564f10531581e3fb8cddbb0d90fa64278e7d9fa93e0e50365321c6e84fe924fe7c1740fda7bf724ec5659345d"' :
                                            'id="xs-controllers-links-module-RequirementsModule-e12a14f9f06fefd07940da367d77ea410cde0b7564f10531581e3fb8cddbb0d90fa64278e7d9fa93e0e50365321c6e84fe924fe7c1740fda7bf724ec5659345d"' }>
                                            <li class="link">
                                                <a href="controllers/RequirementsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RequirementsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RequirementsModule-e12a14f9f06fefd07940da367d77ea410cde0b7564f10531581e3fb8cddbb0d90fa64278e7d9fa93e0e50365321c6e84fe924fe7c1740fda7bf724ec5659345d"' : 'data-bs-target="#xs-injectables-links-module-RequirementsModule-e12a14f9f06fefd07940da367d77ea410cde0b7564f10531581e3fb8cddbb0d90fa64278e7d9fa93e0e50365321c6e84fe924fe7c1740fda7bf724ec5659345d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RequirementsModule-e12a14f9f06fefd07940da367d77ea410cde0b7564f10531581e3fb8cddbb0d90fa64278e7d9fa93e0e50365321c6e84fe924fe7c1740fda7bf724ec5659345d"' :
                                        'id="xs-injectables-links-module-RequirementsModule-e12a14f9f06fefd07940da367d77ea410cde0b7564f10531581e3fb8cddbb0d90fa64278e7d9fa93e0e50365321c6e84fe924fe7c1740fda7bf724ec5659345d"' }>
                                        <li class="link">
                                            <a href="injectables/RequirementsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RequirementsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SectionsModule.html" data-type="entity-link" >SectionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SectionsModule-20da9be1c02c5e4ffcde6d3c40feacbdc3553ccd24d28ce01a6e7871bf7007790147ba8e1045706f0c5eef1b062c605becff5faa2d3b2ee94804bc0187eb953e"' : 'data-bs-target="#xs-controllers-links-module-SectionsModule-20da9be1c02c5e4ffcde6d3c40feacbdc3553ccd24d28ce01a6e7871bf7007790147ba8e1045706f0c5eef1b062c605becff5faa2d3b2ee94804bc0187eb953e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SectionsModule-20da9be1c02c5e4ffcde6d3c40feacbdc3553ccd24d28ce01a6e7871bf7007790147ba8e1045706f0c5eef1b062c605becff5faa2d3b2ee94804bc0187eb953e"' :
                                            'id="xs-controllers-links-module-SectionsModule-20da9be1c02c5e4ffcde6d3c40feacbdc3553ccd24d28ce01a6e7871bf7007790147ba8e1045706f0c5eef1b062c605becff5faa2d3b2ee94804bc0187eb953e"' }>
                                            <li class="link">
                                                <a href="controllers/SectionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SectionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SectionsModule-20da9be1c02c5e4ffcde6d3c40feacbdc3553ccd24d28ce01a6e7871bf7007790147ba8e1045706f0c5eef1b062c605becff5faa2d3b2ee94804bc0187eb953e"' : 'data-bs-target="#xs-injectables-links-module-SectionsModule-20da9be1c02c5e4ffcde6d3c40feacbdc3553ccd24d28ce01a6e7871bf7007790147ba8e1045706f0c5eef1b062c605becff5faa2d3b2ee94804bc0187eb953e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SectionsModule-20da9be1c02c5e4ffcde6d3c40feacbdc3553ccd24d28ce01a6e7871bf7007790147ba8e1045706f0c5eef1b062c605becff5faa2d3b2ee94804bc0187eb953e"' :
                                        'id="xs-injectables-links-module-SectionsModule-20da9be1c02c5e4ffcde6d3c40feacbdc3553ccd24d28ce01a6e7871bf7007790147ba8e1045706f0c5eef1b062c605becff5faa2d3b2ee94804bc0187eb953e"' }>
                                        <li class="link">
                                            <a href="injectables/SectionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SectionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SeedModule.html" data-type="entity-link" >SeedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SeedModule-9d56e9204c3e0294da998d03e9c0153a794f9ddfcc133f4a2317a0a202b7f0f31d1317bfbe9c536c3dfafba303bc71f07be4cf5e7cbfaac3fdfe4124b994bd39"' : 'data-bs-target="#xs-controllers-links-module-SeedModule-9d56e9204c3e0294da998d03e9c0153a794f9ddfcc133f4a2317a0a202b7f0f31d1317bfbe9c536c3dfafba303bc71f07be4cf5e7cbfaac3fdfe4124b994bd39"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SeedModule-9d56e9204c3e0294da998d03e9c0153a794f9ddfcc133f4a2317a0a202b7f0f31d1317bfbe9c536c3dfafba303bc71f07be4cf5e7cbfaac3fdfe4124b994bd39"' :
                                            'id="xs-controllers-links-module-SeedModule-9d56e9204c3e0294da998d03e9c0153a794f9ddfcc133f4a2317a0a202b7f0f31d1317bfbe9c536c3dfafba303bc71f07be4cf5e7cbfaac3fdfe4124b994bd39"' }>
                                            <li class="link">
                                                <a href="controllers/SeedController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeedController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SeedModule-9d56e9204c3e0294da998d03e9c0153a794f9ddfcc133f4a2317a0a202b7f0f31d1317bfbe9c536c3dfafba303bc71f07be4cf5e7cbfaac3fdfe4124b994bd39"' : 'data-bs-target="#xs-injectables-links-module-SeedModule-9d56e9204c3e0294da998d03e9c0153a794f9ddfcc133f4a2317a0a202b7f0f31d1317bfbe9c536c3dfafba303bc71f07be4cf5e7cbfaac3fdfe4124b994bd39"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SeedModule-9d56e9204c3e0294da998d03e9c0153a794f9ddfcc133f4a2317a0a202b7f0f31d1317bfbe9c536c3dfafba303bc71f07be4cf5e7cbfaac3fdfe4124b994bd39"' :
                                        'id="xs-injectables-links-module-SeedModule-9d56e9204c3e0294da998d03e9c0153a794f9ddfcc133f4a2317a0a202b7f0f31d1317bfbe9c536c3dfafba303bc71f07be4cf5e7cbfaac3fdfe4124b994bd39"' }>
                                        <li class="link">
                                            <a href="injectables/SeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StudentsModule.html" data-type="entity-link" >StudentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-StudentsModule-f1f3d0a644c7fc3693660e57a6fb824424ffce5b1d6d3823954e13174fa37c7c168a7ec6a538c37efb84c9912a3f5ffe37ba76ca49567e380e27066ccf46ff2f"' : 'data-bs-target="#xs-controllers-links-module-StudentsModule-f1f3d0a644c7fc3693660e57a6fb824424ffce5b1d6d3823954e13174fa37c7c168a7ec6a538c37efb84c9912a3f5ffe37ba76ca49567e380e27066ccf46ff2f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StudentsModule-f1f3d0a644c7fc3693660e57a6fb824424ffce5b1d6d3823954e13174fa37c7c168a7ec6a538c37efb84c9912a3f5ffe37ba76ca49567e380e27066ccf46ff2f"' :
                                            'id="xs-controllers-links-module-StudentsModule-f1f3d0a644c7fc3693660e57a6fb824424ffce5b1d6d3823954e13174fa37c7c168a7ec6a538c37efb84c9912a3f5ffe37ba76ca49567e380e27066ccf46ff2f"' }>
                                            <li class="link">
                                                <a href="controllers/StudentsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StudentsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StudentsModule-f1f3d0a644c7fc3693660e57a6fb824424ffce5b1d6d3823954e13174fa37c7c168a7ec6a538c37efb84c9912a3f5ffe37ba76ca49567e380e27066ccf46ff2f"' : 'data-bs-target="#xs-injectables-links-module-StudentsModule-f1f3d0a644c7fc3693660e57a6fb824424ffce5b1d6d3823954e13174fa37c7c168a7ec6a538c37efb84c9912a3f5ffe37ba76ca49567e380e27066ccf46ff2f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StudentsModule-f1f3d0a644c7fc3693660e57a6fb824424ffce5b1d6d3823954e13174fa37c7c168a7ec6a538c37efb84c9912a3f5ffe37ba76ca49567e380e27066ccf46ff2f"' :
                                        'id="xs-injectables-links-module-StudentsModule-f1f3d0a644c7fc3693660e57a6fb824424ffce5b1d6d3823954e13174fa37c7c168a7ec6a538c37efb84c9912a3f5ffe37ba76ca49567e380e27066ccf46ff2f"' }>
                                        <li class="link">
                                            <a href="injectables/StudentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StudentsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TagsModule.html" data-type="entity-link" >TagsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TagsModule-234dedadc183ee5bc369794de102eb623157820c9542026adc8df805e3c83aafc387e7bb2ba13c7eb855932a170129dd10bb377945534a1317a568d73de776aa"' : 'data-bs-target="#xs-controllers-links-module-TagsModule-234dedadc183ee5bc369794de102eb623157820c9542026adc8df805e3c83aafc387e7bb2ba13c7eb855932a170129dd10bb377945534a1317a568d73de776aa"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TagsModule-234dedadc183ee5bc369794de102eb623157820c9542026adc8df805e3c83aafc387e7bb2ba13c7eb855932a170129dd10bb377945534a1317a568d73de776aa"' :
                                            'id="xs-controllers-links-module-TagsModule-234dedadc183ee5bc369794de102eb623157820c9542026adc8df805e3c83aafc387e7bb2ba13c7eb855932a170129dd10bb377945534a1317a568d73de776aa"' }>
                                            <li class="link">
                                                <a href="controllers/TagsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TagsModule-234dedadc183ee5bc369794de102eb623157820c9542026adc8df805e3c83aafc387e7bb2ba13c7eb855932a170129dd10bb377945534a1317a568d73de776aa"' : 'data-bs-target="#xs-injectables-links-module-TagsModule-234dedadc183ee5bc369794de102eb623157820c9542026adc8df805e3c83aafc387e7bb2ba13c7eb855932a170129dd10bb377945534a1317a568d73de776aa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TagsModule-234dedadc183ee5bc369794de102eb623157820c9542026adc8df805e3c83aafc387e7bb2ba13c7eb855932a170129dd10bb377945534a1317a568d73de776aa"' :
                                        'id="xs-injectables-links-module-TagsModule-234dedadc183ee5bc369794de102eb623157820c9542026adc8df805e3c83aafc387e7bb2ba13c7eb855932a170129dd10bb377945534a1317a568d73de776aa"' }>
                                        <li class="link">
                                            <a href="injectables/TagsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TasksModule.html" data-type="entity-link" >TasksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TasksModule-f08456e5cd73e9755cf5d32096941ebb498b5ebdb7f2c5dbc62a1055b484275dabea986fbdda05881ef3f18265bcd9d937c797678d45d7ed672d1a4a1a0714c8"' : 'data-bs-target="#xs-controllers-links-module-TasksModule-f08456e5cd73e9755cf5d32096941ebb498b5ebdb7f2c5dbc62a1055b484275dabea986fbdda05881ef3f18265bcd9d937c797678d45d7ed672d1a4a1a0714c8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TasksModule-f08456e5cd73e9755cf5d32096941ebb498b5ebdb7f2c5dbc62a1055b484275dabea986fbdda05881ef3f18265bcd9d937c797678d45d7ed672d1a4a1a0714c8"' :
                                            'id="xs-controllers-links-module-TasksModule-f08456e5cd73e9755cf5d32096941ebb498b5ebdb7f2c5dbc62a1055b484275dabea986fbdda05881ef3f18265bcd9d937c797678d45d7ed672d1a4a1a0714c8"' }>
                                            <li class="link">
                                                <a href="controllers/TasksController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TasksController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TasksModule-f08456e5cd73e9755cf5d32096941ebb498b5ebdb7f2c5dbc62a1055b484275dabea986fbdda05881ef3f18265bcd9d937c797678d45d7ed672d1a4a1a0714c8"' : 'data-bs-target="#xs-injectables-links-module-TasksModule-f08456e5cd73e9755cf5d32096941ebb498b5ebdb7f2c5dbc62a1055b484275dabea986fbdda05881ef3f18265bcd9d937c797678d45d7ed672d1a4a1a0714c8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TasksModule-f08456e5cd73e9755cf5d32096941ebb498b5ebdb7f2c5dbc62a1055b484275dabea986fbdda05881ef3f18265bcd9d937c797678d45d7ed672d1a4a1a0714c8"' :
                                        'id="xs-injectables-links-module-TasksModule-f08456e5cd73e9755cf5d32096941ebb498b5ebdb7f2c5dbc62a1055b484275dabea986fbdda05881ef3f18265bcd9d937c797678d45d7ed672d1a4a1a0714c8"' }>
                                        <li class="link">
                                            <a href="injectables/TasksService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TasksService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TeachingAssistancesModule.html" data-type="entity-link" >TeachingAssistancesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TeachingAssistancesModule-d531a8a2b897e9c596a36f5d2c0eaba42f90494ad7af49f78466c265efbf66134b8b2f507eee12ed742aaa4f00edce79a5ac0701f0eb63bf6a51a566bbb07fb7"' : 'data-bs-target="#xs-controllers-links-module-TeachingAssistancesModule-d531a8a2b897e9c596a36f5d2c0eaba42f90494ad7af49f78466c265efbf66134b8b2f507eee12ed742aaa4f00edce79a5ac0701f0eb63bf6a51a566bbb07fb7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TeachingAssistancesModule-d531a8a2b897e9c596a36f5d2c0eaba42f90494ad7af49f78466c265efbf66134b8b2f507eee12ed742aaa4f00edce79a5ac0701f0eb63bf6a51a566bbb07fb7"' :
                                            'id="xs-controllers-links-module-TeachingAssistancesModule-d531a8a2b897e9c596a36f5d2c0eaba42f90494ad7af49f78466c265efbf66134b8b2f507eee12ed742aaa4f00edce79a5ac0701f0eb63bf6a51a566bbb07fb7"' }>
                                            <li class="link">
                                                <a href="controllers/TeachingAssistancesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TeachingAssistancesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TeachingAssistancesModule-d531a8a2b897e9c596a36f5d2c0eaba42f90494ad7af49f78466c265efbf66134b8b2f507eee12ed742aaa4f00edce79a5ac0701f0eb63bf6a51a566bbb07fb7"' : 'data-bs-target="#xs-injectables-links-module-TeachingAssistancesModule-d531a8a2b897e9c596a36f5d2c0eaba42f90494ad7af49f78466c265efbf66134b8b2f507eee12ed742aaa4f00edce79a5ac0701f0eb63bf6a51a566bbb07fb7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TeachingAssistancesModule-d531a8a2b897e9c596a36f5d2c0eaba42f90494ad7af49f78466c265efbf66134b8b2f507eee12ed742aaa4f00edce79a5ac0701f0eb63bf6a51a566bbb07fb7"' :
                                        'id="xs-injectables-links-module-TeachingAssistancesModule-d531a8a2b897e9c596a36f5d2c0eaba42f90494ad7af49f78466c265efbf66134b8b2f507eee12ed742aaa4f00edce79a5ac0701f0eb63bf6a51a566bbb07fb7"' }>
                                        <li class="link">
                                            <a href="injectables/TeachingAssistancesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TeachingAssistancesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ThesesModule.html" data-type="entity-link" >ThesesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ThesesModule-e91ecb205bbe91184f2381745daee0d88c3d841b656c1be204ca5f1a3ff48df433d083023ad94b9b62cba1c96abdc069ffb82924234dbabf08c4ebbdebce6732"' : 'data-bs-target="#xs-controllers-links-module-ThesesModule-e91ecb205bbe91184f2381745daee0d88c3d841b656c1be204ca5f1a3ff48df433d083023ad94b9b62cba1c96abdc069ffb82924234dbabf08c4ebbdebce6732"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ThesesModule-e91ecb205bbe91184f2381745daee0d88c3d841b656c1be204ca5f1a3ff48df433d083023ad94b9b62cba1c96abdc069ffb82924234dbabf08c4ebbdebce6732"' :
                                            'id="xs-controllers-links-module-ThesesModule-e91ecb205bbe91184f2381745daee0d88c3d841b656c1be204ca5f1a3ff48df433d083023ad94b9b62cba1c96abdc069ffb82924234dbabf08c4ebbdebce6732"' }>
                                            <li class="link">
                                                <a href="controllers/ThesesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThesesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ThesesModule-e91ecb205bbe91184f2381745daee0d88c3d841b656c1be204ca5f1a3ff48df433d083023ad94b9b62cba1c96abdc069ffb82924234dbabf08c4ebbdebce6732"' : 'data-bs-target="#xs-injectables-links-module-ThesesModule-e91ecb205bbe91184f2381745daee0d88c3d841b656c1be204ca5f1a3ff48df433d083023ad94b9b62cba1c96abdc069ffb82924234dbabf08c4ebbdebce6732"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ThesesModule-e91ecb205bbe91184f2381745daee0d88c3d841b656c1be204ca5f1a3ff48df433d083023ad94b9b62cba1c96abdc069ffb82924234dbabf08c4ebbdebce6732"' :
                                        'id="xs-injectables-links-module-ThesesModule-e91ecb205bbe91184f2381745daee0d88c3d841b656c1be204ca5f1a3ff48df433d083023ad94b9b62cba1c96abdc069ffb82924234dbabf08c4ebbdebce6732"' }>
                                        <li class="link">
                                            <a href="injectables/ThesesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThesesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ThesisApplicationsModule.html" data-type="entity-link" >ThesisApplicationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ThesisApplicationsModule-25e53824d03dc7522542398b57b930041cf8651d44e164f79c33e7b55ed20ceccb98bdf3ea767f20b6256657f363b3d7ea822016e59149b3a5581bc793d80b68"' : 'data-bs-target="#xs-controllers-links-module-ThesisApplicationsModule-25e53824d03dc7522542398b57b930041cf8651d44e164f79c33e7b55ed20ceccb98bdf3ea767f20b6256657f363b3d7ea822016e59149b3a5581bc793d80b68"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ThesisApplicationsModule-25e53824d03dc7522542398b57b930041cf8651d44e164f79c33e7b55ed20ceccb98bdf3ea767f20b6256657f363b3d7ea822016e59149b3a5581bc793d80b68"' :
                                            'id="xs-controllers-links-module-ThesisApplicationsModule-25e53824d03dc7522542398b57b930041cf8651d44e164f79c33e7b55ed20ceccb98bdf3ea767f20b6256657f363b3d7ea822016e59149b3a5581bc793d80b68"' }>
                                            <li class="link">
                                                <a href="controllers/ThesisApplicationsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThesisApplicationsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ThesisApplicationsModule-25e53824d03dc7522542398b57b930041cf8651d44e164f79c33e7b55ed20ceccb98bdf3ea767f20b6256657f363b3d7ea822016e59149b3a5581bc793d80b68"' : 'data-bs-target="#xs-injectables-links-module-ThesisApplicationsModule-25e53824d03dc7522542398b57b930041cf8651d44e164f79c33e7b55ed20ceccb98bdf3ea767f20b6256657f363b3d7ea822016e59149b3a5581bc793d80b68"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ThesisApplicationsModule-25e53824d03dc7522542398b57b930041cf8651d44e164f79c33e7b55ed20ceccb98bdf3ea767f20b6256657f363b3d7ea822016e59149b3a5581bc793d80b68"' :
                                        'id="xs-injectables-links-module-ThesisApplicationsModule-25e53824d03dc7522542398b57b930041cf8651d44e164f79c33e7b55ed20ceccb98bdf3ea767f20b6256657f363b3d7ea822016e59149b3a5581bc793d80b68"' }>
                                        <li class="link">
                                            <a href="injectables/ThesisApplicationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThesisApplicationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AreasOfInterestController.html" data-type="entity-link" >AreasOfInterestController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AssistanceApplicationsController.html" data-type="entity-link" >AssistanceApplicationsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BillboardsController.html" data-type="entity-link" >BillboardsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CoordinatorsController.html" data-type="entity-link" >CoordinatorsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CourseController.html" data-type="entity-link" >CourseController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DocumentsController.html" data-type="entity-link" >DocumentsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/GraduatedAssistancesController.html" data-type="entity-link" >GraduatedAssistancesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ImportantDatesController.html" data-type="entity-link" >ImportantDatesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/IncidencesController.html" data-type="entity-link" >IncidencesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PeriodsController.html" data-type="entity-link" >PeriodsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProfessorsController.html" data-type="entity-link" >ProfessorsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProgramsController.html" data-type="entity-link" >ProgramsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProjectApplicationsController.html" data-type="entity-link" >ProjectApplicationsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProjectController.html" data-type="entity-link" >ProjectController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RequirementsController.html" data-type="entity-link" >RequirementsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SectionController.html" data-type="entity-link" >SectionController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SeedController.html" data-type="entity-link" >SeedController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/StudentsController.html" data-type="entity-link" >StudentsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TagsController.html" data-type="entity-link" >TagsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TasksController.html" data-type="entity-link" >TasksController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TeachingAssistancesController.html" data-type="entity-link" >TeachingAssistancesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ThesesController.html" data-type="entity-link" >ThesesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ThesisApplicationsController.html" data-type="entity-link" >ThesisApplicationsController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/AreasOfInterest.html" data-type="entity-link" >AreasOfInterest</a>
                                </li>
                                <li class="link">
                                    <a href="entities/AssistanceApplication.html" data-type="entity-link" >AssistanceApplication</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Billboard.html" data-type="entity-link" >Billboard</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Coordinator.html" data-type="entity-link" >Coordinator</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Course.html" data-type="entity-link" >Course</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Document.html" data-type="entity-link" >Document</a>
                                </li>
                                <li class="link">
                                    <a href="entities/GraduatedAssistance.html" data-type="entity-link" >GraduatedAssistance</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ImportantDate.html" data-type="entity-link" >ImportantDate</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Incidence.html" data-type="entity-link" >Incidence</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Period.html" data-type="entity-link" >Period</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Professor.html" data-type="entity-link" >Professor</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Program.html" data-type="entity-link" >Program</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Project.html" data-type="entity-link" >Project</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProjectApplication.html" data-type="entity-link" >ProjectApplication</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Requirement.html" data-type="entity-link" >Requirement</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Section.html" data-type="entity-link" >Section</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Student.html" data-type="entity-link" >Student</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Tag.html" data-type="entity-link" >Tag</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Task.html" data-type="entity-link" >Task</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TeachingAssistance.html" data-type="entity-link" >TeachingAssistance</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Thesis.html" data-type="entity-link" >Thesis</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ThesisApplication.html" data-type="entity-link" >ThesisApplication</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Base.html" data-type="entity-link" >Base</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAreasOfInterestDto.html" data-type="entity-link" >CreateAreasOfInterestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAssistanceApplicationDto.html" data-type="entity-link" >CreateAssistanceApplicationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBillboardDto.html" data-type="entity-link" >CreateBillboardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCoordinatorDto.html" data-type="entity-link" >CreateCoordinatorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCourseDto.html" data-type="entity-link" >CreateCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateDocumentDto.html" data-type="entity-link" >CreateDocumentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGraduatedAssistanceDto.html" data-type="entity-link" >CreateGraduatedAssistanceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateImportantDateDto.html" data-type="entity-link" >CreateImportantDateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateIncidenceDto.html" data-type="entity-link" >CreateIncidenceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePeriodDto.html" data-type="entity-link" >CreatePeriodDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfessorDto.html" data-type="entity-link" >CreateProfessorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProgramDto.html" data-type="entity-link" >CreateProgramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProjectApplicationDto.html" data-type="entity-link" >CreateProjectApplicationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProjectDto.html" data-type="entity-link" >CreateProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRequirementDto.html" data-type="entity-link" >CreateRequirementDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSectionDto.html" data-type="entity-link" >CreateSectionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateStudentDto.html" data-type="entity-link" >CreateStudentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTagDto.html" data-type="entity-link" >CreateTagDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTaskDto.html" data-type="entity-link" >CreateTaskDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTeachingAssistanceDto.html" data-type="entity-link" >CreateTeachingAssistanceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateThesisApplicationDto.html" data-type="entity-link" >CreateThesisApplicationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateThesisDto.html" data-type="entity-link" >CreateThesisDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAreasOfInterestDto.html" data-type="entity-link" >UpdateAreasOfInterestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAssistanceApplicationDto.html" data-type="entity-link" >UpdateAssistanceApplicationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBillboardDto.html" data-type="entity-link" >UpdateBillboardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCoordinatorDto.html" data-type="entity-link" >UpdateCoordinatorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCourseDto.html" data-type="entity-link" >UpdateCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateDocumentDto.html" data-type="entity-link" >UpdateDocumentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateGraduatedAssistanceDto.html" data-type="entity-link" >UpdateGraduatedAssistanceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateImportantDateDto.html" data-type="entity-link" >UpdateImportantDateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateIncidenceDto.html" data-type="entity-link" >UpdateIncidenceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePeriodDto.html" data-type="entity-link" >UpdatePeriodDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfessorDto.html" data-type="entity-link" >UpdateProfessorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProgramDto.html" data-type="entity-link" >UpdateProgramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProjectApplicationDto.html" data-type="entity-link" >UpdateProjectApplicationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProjectDto.html" data-type="entity-link" >UpdateProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRequirementDto.html" data-type="entity-link" >UpdateRequirementDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSectionDto.html" data-type="entity-link" >UpdateSectionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStudentDto.html" data-type="entity-link" >UpdateStudentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTagDto.html" data-type="entity-link" >UpdateTagDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTaskDto.html" data-type="entity-link" >UpdateTaskDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTeachingAssistanceDto.html" data-type="entity-link" >UpdateTeachingAssistanceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateThesisApplicationDto.html" data-type="entity-link" >UpdateThesisApplicationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateThesisDto.html" data-type="entity-link" >UpdateThesisDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AreasOfInterestService.html" data-type="entity-link" >AreasOfInterestService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AssistanceApplicationsService.html" data-type="entity-link" >AssistanceApplicationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BillboardsService.html" data-type="entity-link" >BillboardsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CoordinatorsService.html" data-type="entity-link" >CoordinatorsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CoursesService.html" data-type="entity-link" >CoursesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DocumentsService.html" data-type="entity-link" >DocumentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GraduatedAssistancesService.html" data-type="entity-link" >GraduatedAssistancesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImportantDatesService.html" data-type="entity-link" >ImportantDatesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IncidencesService.html" data-type="entity-link" >IncidencesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PeriodsService.html" data-type="entity-link" >PeriodsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfessorsService.html" data-type="entity-link" >ProfessorsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProgramsService.html" data-type="entity-link" >ProgramsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectApplicationsService.html" data-type="entity-link" >ProjectApplicationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectsService.html" data-type="entity-link" >ProjectsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequirementsService.html" data-type="entity-link" >RequirementsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SectionsService.html" data-type="entity-link" >SectionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SeedService.html" data-type="entity-link" >SeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StudentsService.html" data-type="entity-link" >StudentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TagsService.html" data-type="entity-link" >TagsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TasksService.html" data-type="entity-link" >TasksService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeachingAssistancesService.html" data-type="entity-link" >TeachingAssistancesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThesesService.html" data-type="entity-link" >ThesesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThesisApplicationsService.html" data-type="entity-link" >ThesisApplicationsService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Applicant.html" data-type="entity-link" >Applicant</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Assistance.html" data-type="entity-link" >Assistance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceListProps.html" data-type="entity-link" >AssistanceListProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceProps.html" data-type="entity-link" >AssistanceProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ButtonProps.html" data-type="entity-link" >ButtonProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Coordinator.html" data-type="entity-link" >Coordinator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Course.html" data-type="entity-link" >Course</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogTextProps.html" data-type="entity-link" >DialogTextProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterBarProps.html" data-type="entity-link" >FilterBarProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeneralProps.html" data-type="entity-link" >GeneralProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraduatedAssistance.html" data-type="entity-link" >GraduatedAssistance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraduatedAssistanceApplication.html" data-type="entity-link" >GraduatedAssistanceApplication</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HomeState.html" data-type="entity-link" >HomeState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InfoItemProps.html" data-type="entity-link" >InfoItemProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InformationCardProps.html" data-type="entity-link" >InformationCardProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InformationSectionProps.html" data-type="entity-link" >InformationSectionProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Period.html" data-type="entity-link" >Period</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Professor.html" data-type="entity-link" >Professor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProfessorThesisListState.html" data-type="entity-link" >ProfessorThesisListState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProfessorThesisListState-1.html" data-type="entity-link" >ProfessorThesisListState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Requirement.html" data-type="entity-link" >Requirement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Section.html" data-type="entity-link" >Section</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectionProps.html" data-type="entity-link" >SectionProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectListProps.html" data-type="entity-link" >SelectListProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatusInformation.html" data-type="entity-link" >StatusInformation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatusInformation-1.html" data-type="entity-link" >StatusInformation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatusProps.html" data-type="entity-link" >StatusProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StepSphereProps.html" data-type="entity-link" >StepSphereProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Student.html" data-type="entity-link" >Student</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Student-1.html" data-type="entity-link" >Student</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentDetail.html" data-type="entity-link" >StudentDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TabStatusProps.html" data-type="entity-link" >TabStatusProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Task.html" data-type="entity-link" >Task</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Task-1.html" data-type="entity-link" >Task</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeachingAssistantListState.html" data-type="entity-link" >TeachingAssistantListState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Thesis.html" data-type="entity-link" >Thesis</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThesisDatesInterface.html" data-type="entity-link" >ThesisDatesInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThesisInscriptionState.html" data-type="entity-link" >ThesisInscriptionState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThesisListState.html" data-type="entity-link" >ThesisListState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tutorial.html" data-type="entity-link" >Tutorial</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});