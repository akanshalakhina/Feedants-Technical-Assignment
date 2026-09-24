import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { api, ReviewItem } from '../services/api';
import { AddReviewModal } from './AddReviewModal';
import { ChatDotsIcon } from './Icons';

interface Props {
  competitionId: string;
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
}

export function ReviewsSection({ competitionId, isLoggedIn, onLoginPrompt }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(5.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!competitionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.reviews.list(competitionId);
      setReviews(data.reviews || []);
      setTotalReviews(data.totalReviews || 0);
      setAverageRating(data.averageRating || 5.0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleOpenAddReview = () => {
    if (!isLoggedIn) {
      onLoginPrompt();
      return;
    }
    setModalVisible(true);
  };

  const handleReviewAdded = (newReview: ReviewItem) => {
    setReviews((prev) => [newReview, ...prev]);
    setTotalReviews((prev) => prev + 1);
    fetchReviews();
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  return (
    <View style={styles.container}>
      {/* Clickable Header card matching page 3 screenshot */}
      <TouchableOpacity
        style={[styles.cardHeader, expanded && styles.cardHeaderExpanded]}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.8}
      >
        <View style={styles.chatIconCircle}>
          <ChatDotsIcon size={16} color="#0B1E3B" />
        </View>

        <View style={styles.headerLeft}>
          <Text style={styles.hearTitle}>Hear From Our Users</Text>
          <Text style={styles.hearSub}>See what participants say about Feedants</Text>
        </View>

        <Text style={[styles.hearArrow, expanded && styles.hearArrowExpanded]}>
          {expanded ? '▲' : '›'}
        </Text>
      </TouchableOpacity>

      {/* Expanded Review List & Add Review Box */}
      {expanded && (
        <View style={styles.body}>
          {/* Summary & Action bar */}
          <View style={styles.summaryBar}>
            <View style={styles.ratingOverview}>
              <Text style={styles.bigRating}>{averageRating.toFixed(1)}</Text>
              <View>
                <Text style={styles.starDisplay}>{renderStars(averageRating)}</Text>
                <Text style={styles.reviewCountText}>
                  Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.addReviewBtn} onPress={handleOpenAddReview}>
              <Text style={styles.addReviewBtnText}>+ Add Review</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.centerBox}>
              <ActivityIndicator color="#00796B" size="small" />
              <Text style={styles.loadingText}>Loading reviews...</Text>
            </View>
          )}

          {error && !loading && (
            <View style={styles.centerBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchReviews} style={styles.retryBtn}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && reviews.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No reviews yet for this competition.</Text>
              <Text style={styles.emptySubText}>Be the first to share your experience!</Text>
            </View>
          )}

          {!loading && !error && reviews.length > 0 && (
            <View style={styles.reviewList}>
              {reviews.map((item) => (
                <View key={item._id} style={styles.reviewItem}>
                  <View style={styles.reviewerRow}>
                    <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.userName}>{item.userName}</Text>
                      <Text style={styles.itemStars}>{'★'.repeat(item.rating)}</Text>
                    </View>
                    <Text style={styles.dateText}>
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.comment}>{item.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Modal to add a new review */}
      <AddReviewModal
        visible={modalVisible}
        competitionId={competitionId}
        onClose={() => setModalVisible(false)}
        onSuccess={handleReviewAdded}
      />
    </View>
  );
}

const TEAL = '#00796B';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEF0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  cardHeaderExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  chatIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  hearTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0B1E3B',
  },
  hearSub: {
    fontSize: 11,
    color: '#707E94',
    marginTop: 2,
  },
  hearArrow: {
    fontSize: 20,
    color: '#0B1E3B',
    fontWeight: '700',
    marginLeft: 6,
  },
  hearArrowExpanded: {
    fontSize: 12,
    color: TEAL,
  },
  body: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#ECEEF0',
    padding: 12,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 10,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bigRating: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  starDisplay: {
    fontSize: 11,
    color: '#F5A623',
  },
  reviewCountText: {
    fontSize: 10,
    color: '#6B7280',
  },
  addReviewBtn: {
    backgroundColor: '#E6F7F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  addReviewBtnText: {
    fontSize: 11,
    color: TEAL,
    fontWeight: '700',
  },
  centerBox: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#E53E3E',
    marginBottom: 6,
  },
  retryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  retryBtnText: {
    fontSize: 11,
    color: '#111827',
  },
  emptyBox: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  reviewList: {
    gap: 10,
  },
  reviewItem: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 6,
  },
  reviewerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
  },
  itemStars: {
    fontSize: 10,
    color: '#F5A623',
  },
  dateText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  comment: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 16,
  },
});
