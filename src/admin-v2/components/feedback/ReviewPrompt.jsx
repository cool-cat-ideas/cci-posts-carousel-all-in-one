import React from 'react';
import { ReviewPrompt as SharedReviewPrompt } from '@cci/admin-ui/wp-carousel';
import { apiFetch, pluginData } from '../../api/api';
import { __, coreString } from '../../i18n/i18n';

const copy = {
    quickFeedback: __('Quick feedback', 'cci-posts-carousel'),
    title: __('How is CCI Posts Carousel All In One working for you?', 'cci-posts-carousel'),
    description: __(
        'If this plugin helps your site, a short review helps us keep improving it.',
        'cci-posts-carousel'
    ),
    addReview: __('Add review', 'cci-posts-carousel'),
    openReviewPage: __('Rate on WordPress.org', 'cci-posts-carousel'),
    close: __('Close', 'cci-posts-carousel'),
    dialogTitle: __('Share your CCI Posts Carousel All In One feedback', 'cci-posts-carousel'),
    dialogDescription: __('Your review will be sent for moderation. It will not be published automatically.', 'cci-posts-carousel'),
    rating: __('Rating', 'cci-posts-carousel'),
    setRating: __('Set rating', 'cci-posts-carousel'),
    ratingHelp: __('Choose a rating from 1 to 5 stars.', 'cci-posts-carousel'),
    shortReview: __('Short review', 'cci-posts-carousel'),
    placeholder: __('What worked well? What should we improve?', 'cci-posts-carousel'),
    consentRequired: __('Required consent', 'cci-posts-carousel'),
    cancel: __('Cancel', 'cci-posts-carousel'),
    saveFeedback: __('Save feedback', 'cci-posts-carousel'),
    saving: __('Saving...', 'cci-posts-carousel'),
    thankYou: __('Thank you for your feedback.', 'cci-posts-carousel'),
    failed: __('Failed saving your feedback.', 'cci-posts-carousel'),
    tryAgain: __('Please try again in a moment.', 'cci-posts-carousel'),
};

export default function ReviewPrompt(props) {
    const locale = String(
        pluginData.adminDate?.locale ||
        (typeof document !== 'undefined' ? document.documentElement.lang : '') ||
        'en'
    ).replace('_', '-');
    const consent = {
        codeName: 'productReviewPublication',
        content: coreString(
            'reviewConsentContent',
            'I agree to send this rating and review to Cool Cat Ideas for moderation and possible publication on the product page. The review will not be published automatically.'
        ),
        locale,
        version: 1,
    };
    const mascotUrl = pluginData.assetsUrl
        ? `${pluginData.assetsUrl}assets/images/quick-feedback-mascot.png`
        : '';

    return (
        <SharedReviewPrompt
            {...props}
            apiFetch={apiFetch}
            reviewEndpoint={
                pluginData.reviewEndpoint ||
                pluginData.reviewFeedbackEndpoint ||
                '/wp-json/wp-posts-carousel/v1/admin/review-feedback'
            }
            reviewUrl={
                pluginData.reviewUrl ||
                pluginData.wordpressReviewUrl ||
                'https://wordpress.org/support/plugin/wp-posts-carousel/reviews/#new-post'
            }
            copy={copy}
            consent={consent}
            mascotUrl={mascotUrl}
        />
    );
}
