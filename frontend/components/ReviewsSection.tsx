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
    fetchReviews(); // Recalculate average cleanly from backend
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  return (
    <View style={styles.container}>
      {/* Clickable Header card matching page 3 screenshot */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.hearTitle}>💬 Hear From Our Users</Text>
          <Text style={styles.hearSub}>
            {totalReviews > 0
              ? `${averageRating} ★  •  ${totalReviews} participant review${totalReviews > 1 ? 's' : ''}`
              : 'See what participants say about Feedants'}
          </Text>
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
              <ActivityIndicator color="#16A093" size="small" />
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

const TEAL = '#16A093';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 14,
  },
  headerLeft: {
    flex: 1,
  },
  hearTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  hearSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  hearArrow: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  hearArrowExpanded: {
    fontSize: 14,
    color: TEAL,
  },
  body: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#EBEBEB',
    padding: 14,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 12,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bigRating: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  starDisplay: {
    fontSize: 13,
    color: '#F5A623',
  },
  reviewCountText: {
    fontSize: 11,
    color: '#888',
  },
  addReviewBtn: {
    backgroundColor: '#F0F9F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: TEAL,
  },
  addReviewBtnText: {
    fontSize: 12,
    color: TEAL,
    fontWeight: '700',
  },
  centerBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginBottom: 8,
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  retryBtnText: {
    fontSize: 12,
    color: '#333',
  },
  emptyBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  emptySubText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  reviewList: {
    gap: 12,
  },
  reviewItem: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEE',
    marginRight: 8,
  },
  reviewerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  itemStars: {
    fontSize: 11,
    color: '#F5A623',
  },
  dateText: {
    fontSize: 11,
    color: '#AAA',
  },
  comment: {
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
  },
});
