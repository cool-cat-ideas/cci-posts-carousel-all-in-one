import React from 'react';
import { ReviewPrompt as SharedReviewPrompt } from '@cci/admin-ui/wp-carousel';
import { apiFetch, pluginData } from '../api';
import { __, coreString } from '../i18n';

const copy = {
    quickFeedback: __('Quick feedback', 'wp-posts-carousel'),
    title: __('How is WP Posts Carousel working for you?', 'wp-posts-carousel'),
    description: __(
        'If this plugin helps your site, a short review helps us keep improving it.',
        'wp-posts-carousel'
    ),
    addReview: __('Add review', 'wp-posts-carousel'),
    openReviewPage: __('Rate on WordPress.org', 'wp-posts-carousel'),
    close: __('Close', 'wp-posts-carousel'),
    dialogTitle: __('Share your WP Posts Carousel feedback', 'wp-posts-carousel'),
    dialogDescription: __('Your review will be sent for moderation. It will not be published automatically.', 'wp-posts-carousel'),
    rating: __('Rating', 'wp-posts-carousel'),
    setRating: __('Set rating', 'wp-posts-carousel'),
    ratingHelp: __('Choose a rating from 1 to 5 stars.', 'wp-posts-carousel'),
    shortReview: __('Short review', 'wp-posts-carousel'),
    placeholder: __('What worked well? What should we improve?', 'wp-posts-carousel'),
    consentRequired: __('Required consent', 'wp-posts-carousel'),
    cancel: __('Cancel', 'wp-posts-carousel'),
    saveFeedback: __('Save feedback', 'wp-posts-carousel'),
    saving: __('Saving...', 'wp-posts-carousel'),
    thankYou: __('Thank you for your feedback.', 'wp-posts-carousel'),
    failed: __('Failed saving your feedback.', 'wp-posts-carousel'),
    tryAgain: __('Please try again in a moment.', 'wp-posts-carousel'),
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
